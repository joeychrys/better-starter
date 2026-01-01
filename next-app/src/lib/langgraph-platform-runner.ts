import {
    AbstractAgent,
    BaseEvent,
    EventType,
    Message,
    MessagesSnapshotEvent,
    RunFinishedEvent,
    RunStartedEvent,
    StateSnapshotEvent
} from "@ag-ui/client";
import {
    AgentRunner,
    finalizeRunEvents,
    type AgentRunnerConnectRequest,
    type AgentRunnerIsRunningRequest,
    type AgentRunnerRunRequest,
    type AgentRunnerStopRequest,
} from "@copilotkit/runtime/v2";
import { Client } from "@langchain/langgraph-sdk";
import { Observable, ReplaySubject } from "rxjs";

export interface LangGraphPlatformRunnerOptions {
    /**
     * The LangGraph Platform deployment URL
     * e.g., "http://localhost:8000" or "https://your-deployment.langgraph.cloud"
     */
    deploymentUrl: string;

    /**
     * Optional LangSmith API key for authentication with LangGraph Cloud
     */
    langsmithApiKey?: string;

    /**
     * Optional function to extract user ID from thread ID for multi-tenant isolation
     * This allows you to namespace threads by user
     */
    getUserIdFromThreadId?: (threadId: string) => string | null;
}

interface ActiveConnectionContext {
    subject: ReplaySubject<BaseEvent>;
    agent?: AbstractAgent;
    runSubject?: ReplaySubject<BaseEvent>;
    currentEvents?: BaseEvent[];
    stopRequested?: boolean;
}

// Active connections for streaming events and stop support
const ACTIVE_CONNECTIONS = new Map<string, ActiveConnectionContext>();

// Track running state in memory (LangGraph Platform handles actual persistence)
const RUNNING_THREADS = new Map<string, { runId: string }>();

/**
 * LangGraphPlatformRunner - An AgentRunner that uses LangGraph Platform's
 * native persistence instead of maintaining a separate database.
 *
 * Benefits:
 * - No data duplication - uses LangGraph Platform as the single source of truth
 * - Survives server restarts - state is stored in LangGraph Platform
 * - Scales horizontally - no local SQLite file dependency
 * - Multi-user support - thread IDs can be namespaced by user
 */
export class LangGraphPlatformRunner extends AgentRunner {
    private client: Client;
    private deploymentUrl: string;
    private getUserIdFromThreadId?: (threadId: string) => string | null;

    constructor(options: LangGraphPlatformRunnerOptions) {
        super();
        this.deploymentUrl = options.deploymentUrl;
        this.getUserIdFromThreadId = options.getUserIdFromThreadId;

        // Initialize the LangGraph SDK client
        this.client = new Client({
            apiUrl: options.deploymentUrl,
            apiKey: options.langsmithApiKey,
        });
    }

    /**
     * Convert LangGraph messages to CopilotKit Message format
     */
    private convertLangGraphMessageToMessage(lgMessage: any): Message {
        const role = lgMessage.type === "human" ? "user" : "assistant";

        return {
            id: lgMessage.id || crypto.randomUUID(),
            role,
            content:
                typeof lgMessage.content === "string"
                    ? lgMessage.content
                    : JSON.stringify(lgMessage.content),
        };
    }

    /**
     * Fetch thread state from LangGraph Platform and convert to events
     */
    private async getHistoricEventsFromPlatform(
        threadId: string
    ): Promise<BaseEvent[]> {
        const events: BaseEvent[] = [];

        try {
            // Get thread state from LangGraph Platform
            const threadState = await this.client.threads.getState(threadId);

            if (!threadState || !threadState.values) {
                return events;
            }

            // Cast values to a record type for property access
            const values = threadState.values as Record<string, unknown>;

            // Extract messages from the thread state
            const messages = (values.messages as unknown[]) || [];

            if (messages.length === 0) {
                return events;
            }

            // Create a synthetic RUN_STARTED event
            const runId = (threadState.checkpoint as { id?: string })?.id || crypto.randomUUID();
            const runStartedEvent: RunStartedEvent = {
                type: EventType.RUN_STARTED,
                threadId,
                runId,
            };
            events.push(runStartedEvent);

            // Convert LangGraph messages to CopilotKit messages
            const copilotKitMessages: Message[] = messages.map((msg: unknown) =>
                this.convertLangGraphMessageToMessage(msg)
            );

            // Emit a MESSAGES_SNAPSHOT event with all messages
            if (copilotKitMessages.length > 0) {
                const messagesSnapshotEvent: MessagesSnapshotEvent = {
                    type: EventType.MESSAGES_SNAPSHOT,
                    messages: copilotKitMessages,
                };
                events.push(messagesSnapshotEvent);
            }

            // Emit state snapshot if there's additional state beyond messages
            const stateWithoutMessages = { ...values };
            delete stateWithoutMessages.messages;

            if (Object.keys(stateWithoutMessages).length > 0) {
                const stateSnapshotEvent: StateSnapshotEvent = {
                    type: EventType.STATE_SNAPSHOT,
                    snapshot: stateWithoutMessages,
                };
                events.push(stateSnapshotEvent);
            }

            // Create a synthetic RUN_FINISHED event
            const runFinishedEvent: RunFinishedEvent = {
                type: EventType.RUN_FINISHED,
                threadId,
                runId,
            };
            events.push(runFinishedEvent);
        } catch (error: any) {
            // Thread doesn't exist yet - this is fine, just return empty events
            if (error?.status === 404 || error?.message?.includes("not found")) {
                return events;
            }
            console.error(
                `[LangGraphPlatformRunner] Error fetching thread state:`,
                error
            );
        }

        return events;
    }

    run(request: AgentRunnerRunRequest): Observable<BaseEvent> {
        // Check if thread is already running
        const runState = RUNNING_THREADS.get(request.threadId);
        if (runState) {
            throw new Error("Thread already running");
        }

        // Mark thread as running
        RUNNING_THREADS.set(request.threadId, { runId: request.input.runId });

        // Track current run events in memory
        const currentRunEvents: BaseEvent[] = [];

        // Create subjects for streaming
        const nextSubject = new ReplaySubject<BaseEvent>(Infinity);
        const prevConnection = ACTIVE_CONNECTIONS.get(request.threadId);
        const prevSubject = prevConnection?.subject;

        // Create a subject for run() return value
        const runSubject = new ReplaySubject<BaseEvent>(Infinity);

        // Update the active connection for this thread
        ACTIVE_CONNECTIONS.set(request.threadId, {
            subject: nextSubject,
            agent: request.agent,
            runSubject,
            currentEvents: currentRunEvents,
            stopRequested: false,
        });

        // Helper function to run the agent
        const runAgent = async () => {
            try {
                await request.agent.runAgent(request.input, {
                    onEvent: ({ event }) => {
                        runSubject.next(event);
                        nextSubject.next(event);
                        currentRunEvents.push(event);
                    },
                    onNewMessage: ({ message }) => {
                        // Messages are handled by the agent
                    },
                    onRunStartedEvent: () => {
                        // Run started
                    },
                });

                const connection = ACTIVE_CONNECTIONS.get(request.threadId);
                const appendedEvents = finalizeRunEvents(currentRunEvents, {
                    stopRequested: connection?.stopRequested ?? false,
                });
                for (const event of appendedEvents) {
                    runSubject.next(event);
                    nextSubject.next(event);
                }

                // Clean up
                RUNNING_THREADS.delete(request.threadId);

                if (connection) {
                    connection.agent = undefined;
                    connection.runSubject = undefined;
                    connection.currentEvents = undefined;
                    connection.stopRequested = false;
                }

                runSubject.complete();
                nextSubject.complete();

                ACTIVE_CONNECTIONS.delete(request.threadId);
            } catch (error) {
                const connection = ACTIVE_CONNECTIONS.get(request.threadId);
                const appendedEvents = finalizeRunEvents(currentRunEvents, {
                    stopRequested: connection?.stopRequested ?? false,
                });
                for (const event of appendedEvents) {
                    runSubject.next(event);
                    nextSubject.next(event);
                }

                // Clean up
                RUNNING_THREADS.delete(request.threadId);

                if (connection) {
                    connection.agent = undefined;
                    connection.runSubject = undefined;
                    connection.currentEvents = undefined;
                    connection.stopRequested = false;
                }

                runSubject.complete();
                nextSubject.complete();

                ACTIVE_CONNECTIONS.delete(request.threadId);
            }
        };

        // Bridge previous events if they exist
        if (prevSubject) {
            prevSubject.subscribe({
                next: (e) => nextSubject.next(e),
                error: (err) => nextSubject.error(err),
                complete: () => {
                    // Don't complete nextSubject - it needs to stay open for new events
                },
            });
        }

        // Start the agent execution immediately
        runAgent();

        return runSubject.asObservable();
    }

    connect(request: AgentRunnerConnectRequest): Observable<BaseEvent> {
        const connectionSubject = new ReplaySubject<BaseEvent>(Infinity);

        // Track emitted message IDs to avoid duplicates
        const emittedMessageIds = new Set<string>();

        // Fetch historic events from LangGraph Platform asynchronously
        this.getHistoricEventsFromPlatform(request.threadId)
            .then((historicEvents) => {
                // Emit historic events
                for (const event of historicEvents) {
                    connectionSubject.next(event);
                    if ("messageId" in event && typeof event.messageId === "string") {
                        emittedMessageIds.add(event.messageId);
                    }
                    // Also track message IDs from MessagesSnapshotEvent
                    if (event.type === EventType.MESSAGES_SNAPSHOT) {
                        const messagesEvent = event as MessagesSnapshotEvent;
                        for (const msg of messagesEvent.messages) {
                            emittedMessageIds.add(msg.id);
                        }
                    }
                }

                // Bridge active run to connection if exists
                const activeConnection = ACTIVE_CONNECTIONS.get(request.threadId);
                const isRunning = RUNNING_THREADS.has(request.threadId);

                if (activeConnection && (isRunning || activeConnection.stopRequested)) {
                    activeConnection.subject.subscribe({
                        next: (event) => {
                            // Skip message events that we've already emitted from historic
                            if (
                                "messageId" in event &&
                                typeof event.messageId === "string" &&
                                emittedMessageIds.has(event.messageId)
                            ) {
                                return;
                            }
                            connectionSubject.next(event);
                        },
                        complete: () => connectionSubject.complete(),
                        error: (err) => connectionSubject.error(err),
                    });
                } else {
                    // No active run, complete after historic events
                    connectionSubject.complete();
                }
            })
            .catch((error) => {
                console.error(
                    "[LangGraphPlatformRunner] Error in connect:",
                    error
                );
                connectionSubject.complete();
            });

        return connectionSubject.asObservable();
    }

    isRunning(request: AgentRunnerIsRunningRequest): Promise<boolean> {
        return Promise.resolve(RUNNING_THREADS.has(request.threadId));
    }

    stop(request: AgentRunnerStopRequest): Promise<boolean | undefined> {
        if (!RUNNING_THREADS.has(request.threadId)) {
            return Promise.resolve(false);
        }

        const connection = ACTIVE_CONNECTIONS.get(request.threadId);
        const agent = connection?.agent;

        if (!connection || !agent) {
            return Promise.resolve(false);
        }

        if (connection.stopRequested) {
            return Promise.resolve(false);
        }

        connection.stopRequested = true;
        RUNNING_THREADS.delete(request.threadId);

        try {
            agent.abortRun();
            return Promise.resolve(true);
        } catch (error) {
            console.error(
                "[LangGraphPlatformRunner] Failed to abort agent run",
                error
            );
            connection.stopRequested = false;
            RUNNING_THREADS.set(request.threadId, {
                runId: connection.currentEvents?.[0]?.type === EventType.RUN_STARTED
                    ? (connection.currentEvents[0] as RunStartedEvent).runId
                    : "unknown",
            });
            return Promise.resolve(false);
        }
    }
}


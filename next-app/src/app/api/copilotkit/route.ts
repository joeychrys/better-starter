import { LangGraphPlatformRunner } from "@/lib/langgraph-platform-runner";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  ExperimentalEmptyAdapter,
} from "@copilotkit/runtime";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";
import { NextRequest } from "next/server";

const LANGGRAPH_URL = process.env.LANGGRAPH_URL || "http://host.docker.internal:8000";

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Create the CopilotRuntime instance and utilize the LangGraph AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    'agent': new LangGraphAgent({
      deploymentUrl: LANGGRAPH_URL,
      graphId: 'agent',
    }),
  },
  // Use LangGraph Platform runner - fetches thread history directly from
  // LangGraph Platform's API instead of maintaining a separate database.
  // This eliminates data duplication and survives server restarts.
  runner: new LangGraphPlatformRunner({
    deploymentUrl: LANGGRAPH_URL,
  }),
});
// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const clonedReq = req.clone();
  const url = new URL(req.url);

  try {
    const body = await clonedReq.json();
    console.log("\n=== CopilotKit Request ===");
    console.log("URL Path:", url.pathname);
    console.log("Method:", body.method);
    console.log("Agent ID:", body.params?.agentId || body.agentId);
    console.log("Thread ID:", body.body?.threadId || body.threadId || body.params?.threadId);
    console.log("Run ID:", body.body?.runId || body.runId);

    // Check for GraphQL operations
    if (body.query) {
      console.log("GraphQL Operation:", body.operationName || "unknown");
      console.log("GraphQL Variables:", JSON.stringify(body.variables, null, 2));
    }

    console.log("Full Body Keys:", Object.keys(body));
    console.log("==========================\n");
  } catch (e) {
    console.log("Could not parse request body for logging:", e);
  }

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
import { auth } from "@/lib/auth";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";
import { NextRequest } from "next/server";

const LANGGRAPH_URL = process.env.LANGGRAPH_URL || "http://host.docker.internal:8000";
const serviceAdapter = new ExperimentalEmptyAdapter();

export const POST = async (req: NextRequest) => {
  // Clone the request to read the body for logging
  const clonedReq = req.clone();
  const body = await clonedReq.json();

  console.log("=== CopilotKit Request Body ===");
  console.log(JSON.stringify(body, null, 2));
  console.log("=== End Request Body ===");

  // Get user session
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const runtime = new CopilotRuntime({
    agents: {
      'agent': new LangGraphAgent({
        deploymentUrl: LANGGRAPH_URL,
        graphId: 'agent',
        propertyHeaders:{'authorization': userId},
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

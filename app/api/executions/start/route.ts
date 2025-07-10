import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { NextRequest, NextResponse } from "next/server";

// always a NODE function (Edge cannot spawn chrome)
export const runtime = "nodejs";

/**
 * Vercel will treat the same file as:
 * • a normal function in `vercel dev`  ➜ we do the threading trick
 * • a background function in prod      ➜ we just return 202
 */
export const config = {
	invocation: "background", // ignored by vercel dev, honoured in prod
	maxDuration: 900, // 15 min; irrelevant in dev, useful in prod
	memory: 1024, // 1 GB for chromium
};

export async function POST(req: NextRequest) {
	const { executionId } = await req.json();

	// --- Fire-and-forget in BOTH environments -------------------------
	// We do not *await* ExecuteWorkflow, we just start it.
	// 1. In production Vercel detaches automatically (background fn)
	// 2. In `vercel dev` we have to detach *manually* – setImmediate
	setImmediate(() => ExecuteWorkflow(executionId).catch(console.error));

	return NextResponse.json({ ok: true }, { status: 202 });
}

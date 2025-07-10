import { NextRequest, NextResponse } from "next/server";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export const runtime = "nodejs";
export const config = { invocation: "background", maxDuration: 900 };

export async function POST(req: NextRequest) {
	const { executionId } = await req.json();
	setImmediate(() => ExecuteWorkflow(executionId).catch(console.error));
	return NextResponse.json(null, { status: 202 });
}

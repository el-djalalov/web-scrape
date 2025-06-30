import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import React from "react";
import Editor from "../../_components/Editor";

async function page({ params }: { params: { workflowId: string } }) {
	const { workflowId } = await params;
	const session = await auth();
	if (!session) return <div>Unauthenticated</div>;

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId: session.user.id,
		},
	});

	if (!workflow) {
		return <div>Workflow not found</div>;
	}

	return <Editor workflow={workflow} />;
}

export default page;

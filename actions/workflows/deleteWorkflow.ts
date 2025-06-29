"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflow(id: string) {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}
	await prisma.workflow.delete({
		where: {
			id,
			userId: session.user.id,
		},
	});
	revalidatePath("/workflows");
}

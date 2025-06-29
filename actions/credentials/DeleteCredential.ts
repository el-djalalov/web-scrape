"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(name: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	await prisma.credential.delete({
		where: {
			userId_name: {
				userId: session.user.id,
				name,
			},
		},
	});

	revalidatePath("/credentials");
}

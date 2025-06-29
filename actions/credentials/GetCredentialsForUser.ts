"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetCredentialsForUser() {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	return prisma.credential.findMany({
		where: { userId: session.user.id },
		orderBy: {
			name: "asc",
		},
	});
}

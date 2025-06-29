"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetAvailableCredits() {
	const session = await auth();

	if (!session || !session.user) {
		throw new Error("User not found");
	}

	const balance = await prisma.userBalance.findUnique({
		where: { userId: session.user.id },
	});
	if (!balance) return -1;

	return balance.credits;
}

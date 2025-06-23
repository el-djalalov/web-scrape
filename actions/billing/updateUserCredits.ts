"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function UpdateUserCredits(amount: number) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("Unauthenticated");
	}

	let creditsToAdd = 0;

	if (amount === 9.99) {
		creditsToAdd = 1000;
	} else if (amount === 19.99) {
		creditsToAdd = 2500;
	} else if (amount === 49.99) {
		creditsToAdd = 7500;
	} else {
		throw new Error("Invalid amount");
		return;
	}

	try {
		await prisma.userBalance.update({
			where: { userId },
			data: {
				credits: {
					increment: creditsToAdd,
				},
			},
		});
	} catch (error) {
		console.error("Error updating user credits:", error);
		throw new Error("Failed to update user credits");
	}
}

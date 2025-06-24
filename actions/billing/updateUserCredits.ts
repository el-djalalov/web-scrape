// actions/billing/updateUserCredits.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function UpdateUserCredits(creditsToAdd: number) {
	const { userId } = await auth();

	if (!userId) {
		console.error("No user ID found in session");
		throw new Error("Unauthenticated");
	}

	try {
		// Check if user balance exists
		const existingBalance = await prisma.userBalance.findUnique({
			where: { userId },
		});

		console.log("Existing balance:", existingBalance);

		if (!existingBalance) {
			// Create new balance if it doesn't exist
			await prisma.userBalance.create({
				data: {
					userId,
					credits: creditsToAdd,
				},
			});
		} else {
			// Update existing balance
			await prisma.userBalance.update({
				where: { userId },
				data: {
					credits: {
						increment: creditsToAdd,
					},
				},
			});
		}

		return { success: true, creditsAdded: creditsToAdd };
	} catch (error) {
		console.error("Error updating user credits:", error);
		throw new Error("Failed to update user credits");
	}
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function UpdateUserCredits(creditsToAdd: number) {
	const session = await auth();

	if (!session || !session.user) {
		throw new Error("User not found");
	}

	try {
		// Check if user balance exists
		const existingBalance = await prisma.userBalance.findUnique({
			where: { userId: session.user.id },
		});


		if (!existingBalance) {
			// Create new balance if it doesn't exist
			await prisma.userBalance.create({
				data: {
					userId: session.user.id,
					credits: creditsToAdd,
				},
			});
		} else {
			// Update existing balance
			await prisma.userBalance.update({
				where: { userId: session.user.id },
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

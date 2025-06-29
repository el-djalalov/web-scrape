"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function SetUpuser() {
	const session = await auth();

	if (!session || !session.user) {
		throw new Error("User not found");
	}

	const balance = await prisma.userBalance.findUnique({
		where: { userId: session.user.id },
	});
	if (!balance) {
		// Free 500 credits for new users
		await prisma.userBalance.create({
			data: {
				userId: session.user.id,
				credits: 500,
			},
		});
	}

	redirect("/");
}

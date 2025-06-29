"use server";

import { PackId } from "@/types/billing";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PurchaseCredits(packId: PackId) {
	const session = await auth();

	if (!session || !session.user) {
		throw new Error("User not found");
	}
}

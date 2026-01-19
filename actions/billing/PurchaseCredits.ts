"use server";

import { PackId, getCreditsPack } from "@/types/billing";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-02-24.acacia",
});

export async function PurchaseCredits(packId: PackId) {
	const session = await auth();

	if (!session || !session.user?.id) {
		throw new Error("User not authenticated");
	}

	const pack = getCreditsPack(packId);
	if (!pack) {
		throw new Error("Invalid credit pack selected");
	}

	const checkoutSession = await stripe.checkout.sessions.create({
		mode: "payment",
		payment_method_types: ["card"],
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: "usd",
					unit_amount: pack.price,
					product_data: {
						name: pack.name,
						description: pack.label,
					},
				},
			},
		],
		metadata: {
			userId: session.user.id,
			packId: pack.id,
			credits: pack.credits.toString(),
		},
		success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
	});

	if (!checkoutSession.url) {
		throw new Error("Failed to create checkout session");
	}

	redirect(checkoutSession.url);
}

/**
 * Process a successful payment and add credits to user balance.
 * This should be called from a Stripe webhook handler.
 */
export async function processSuccessfulPayment(
	userId: string,
	credits: number
) {
	await prisma.userBalance.upsert({
		where: { userId },
		update: {
			credits: { increment: credits },
		},
		create: {
			userId,
			credits,
		},
	});
}

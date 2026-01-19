import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
	return new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: "2025-02-24.acacia",
	});
}

export async function POST(request: NextRequest) {
	const stripe = getStripe();
	try {
		const { amount } = await request.json();

		// Validate amount is a positive number
		if (typeof amount !== "number" || amount <= 0) {
			return NextResponse.json(
				{ error: "Invalid amount" },
				{ status: 400 }
			);
		}

		// Amount is already in cents from CreditsPacks (e.g., 999 = $9.99)
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
			},
		});
		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.error("Error creating payment intent:", error);
		return NextResponse.json(
			{ error: "Failed to create payment intent" },
			{ status: 500 }
		);
	}
}

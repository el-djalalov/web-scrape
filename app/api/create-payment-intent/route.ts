import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
	try {
		const { amount } = await request.json();
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount / 100,
			currency: "usd",
			automatic_payment_methods: {
				// Detects from browser which payment method is available
				enabled: true,
			},
		});
		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.error("Error creating payment intent:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

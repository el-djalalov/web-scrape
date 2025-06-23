"use client";

import React, { useEffect } from "react";
import {
	useStripe,
	useElements,
	PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubCurrency from "@/lib/helper/convertToSubCurrency";
import { Button } from "@/components/ui/button";

const CheckoutPage = ({ amount }: { amount: number }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
	const [clientSecret, setClientSecret] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	useEffect(() => {
		fetch("/api/create-payment-intent", {
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				amount: convertToSubCurrency(amount),
			}),
			method: "POST",
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret));
	}, [amount]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		if (!stripe || !elements) {
			return;
		}
		const { error: submitError } = await elements.submit();
		if (submitError) {
			setErrorMessage(submitError.message ?? "An error occurred");
			setIsLoading(false);
			return;
		}
		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret: clientSecret ?? "",
			confirmParams: {
				return_url: `http://localhost:3000/?amount=${amount}`,
			},
		});

		if (error) {
			setErrorMessage(error.message ?? "An error occurred");
		} else {
			// Payment UI automatically handles success
			// Customer will be redirected to the return_url
			setErrorMessage(null);
		}
		setIsLoading(false);
	};

	if (!stripe || !elements || !clientSecret) {
		return (
			<div className="flex items-center justify-center">
				<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-blue-600 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-surface dark:text-white">
					<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
						Loading...
					</span>
				</div>
			</div>
		);
	}

	return (
		<form
			className="bg-white p-2 rounded-lg shadow-md max-w-2xl space-y-4 mt-6"
			onSubmit={handleSubmit}
		>
			{clientSecret && <PaymentElement />}
			{errorMessage && <div>{errorMessage}</div>}
			<Button
				disabled={!stripe || isLoading}
				className="disabled:opacity-50 disabled:animate-pulse w-full"
			>
				{!isLoading ? `Pay $${amount / 100}` : "Processing..."}
			</Button>
		</form>
	);
};

export default CheckoutPage;

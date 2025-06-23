"use client";

import { PurchaseCredits } from "@/actions/billing/PurchaseCredits";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditsPacks, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCard } from "lucide-react";
import React, { useState } from "react";
import CheckoutPage from "./CheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
	throw new Error(
		"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined. Please set it in your environment variables."
	);
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function CreditsPurchase() {
	const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);

	const mutation = useMutation({
		mutationFn: PurchaseCredits,
		onSuccess: () => {},
		onError: () => {},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="gap-2 text-2xl font-bold flex items-center">
					<CoinsIcon className="h-6 w-6 text-primary" />
					Purchase Credits
				</CardTitle>

				<CardDescription>
					Select the number of credits you want to purchase
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RadioGroup
					onValueChange={value => setSelectedPack(value as PackId)}
					value={selectedPack}
				>
					{CreditsPacks.map(pack => (
						<div
							key={pack.id}
							className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
							onClick={() => setSelectedPack(pack.id)}
						>
							<RadioGroupItem value={pack.id} id={pack.id} />
							<Label className="flex justify-between w-full cursor-pointer">
								<span className="font-medium">
									{pack.name} - {pack.label}
								</span>
								<span className="font-bold text-muted-foreground">
									$ {(pack.price / 100).toFixed(2)}
								</span>
							</Label>
						</div>
					))}
				</RadioGroup>
			</CardContent>
			<CardFooter>
				{/* 	<Button
					className="w-full"
					disabled={mutation.isPending}
					onClick={() => {
						//mutation.mutate(selectedPack);
					}}
				>
					<CreditCard className="mr-2 h-8 w-8" /> Purchase credits
				</Button> */}
				<Sheet>
					<SheetTrigger asChild>
						<Button className="w-full" disabled={mutation.isPending}>
							<CreditCard className="mr-2 h-8 w-8" /> Purchase credits
						</Button>
					</SheetTrigger>
					<SheetContent className="min-w-[500px] flex flex-col ">
						<SheetHeader className="flex flex-col items-start gap-0">
							<SheetTitle className="flex items-center">
								<CreditCard className="mr-2 h-8 w-8" />
								Payment process
							</SheetTitle>
							<SheetDescription>
								You are purchasing{" "}
								{CreditsPacks.find(pack => pack.id === selectedPack)?.label} for
								${" "}
								{(
									(CreditsPacks.find(pack => pack.id === selectedPack)?.price ||
										0) / 100
								).toFixed(2)}
							</SheetDescription>
						</SheetHeader>
						<Elements
							stripe={stripePromise}
							options={{
								mode: "payment",
								amount:
									CreditsPacks.find(pack => pack.id === selectedPack)?.price ||
									0,
								currency: "usd",
							}}
						>
							<CheckoutPage
								amount={
									CreditsPacks.find(pack => pack.id === selectedPack)?.price ||
									0
								}
							/>
						</Elements>

						<SheetFooter></SheetFooter>
					</SheetContent>
				</Sheet>
			</CardFooter>
		</Card>
	);
}

export default CreditsPurchase;

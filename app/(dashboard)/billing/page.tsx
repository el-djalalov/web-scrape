import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinsIcon } from "lucide-react";
import { Suspense } from "react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { preloadStripe } from "@/lib/preload";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Billing",
	description: "Manage your credits and billing information.",
};

export default function BillingPage() {
	// Preload Stripe resources early for faster checkout
	preloadStripe();
	return (
		<div className="mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Billing</h1>
			<Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
				<BalanceCard />
			</Suspense>

			<CreditsPurchase />
		</div>
	);
}

async function BalanceCard() {
	const userBalance = await GetAvailableCredits();
	return (
		<Card className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
			<CardContent className="p-6 relative items-center">
				<div className="flex justify-between items-center">
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-1">
							Available credits
						</h3>
						<p className="text-4xl font-bold text-primary">
							<ReactCountUpWrapper value={userBalance} />
						</p>
					</div>

					<CoinsIcon
						size={140}
						className="text-primary opacity-20 absolute bottom-0 right-0 top-5"
					/>
				</div>
			</CardContent>

			<CardFooter className="text-muted-foreground text-sm">
				When your credit balance reaches 0, your workflows will stop working
			</CardFooter>
		</Card>
	);
}

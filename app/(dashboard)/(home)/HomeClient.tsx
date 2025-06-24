"use client";

import React, { useEffect, useRef, useState } from "react";
import { Period } from "@/types/analytics";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import PeriodSelector from "./_components/PeriodSelector";
import StatsCard from "./_components/StatsCard";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import CreditsUsageChart from "../billing/_components/CreditsUsageChart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PaymentSuccessModal from "./_components/PaymentSuccessModal";
import { UpdateUserCredits } from "@/actions/billing/updateUserCredits";
import { useQueryClient } from "@tanstack/react-query";

interface HomeClientProps {
	searchParams: {
		month?: string;
		year?: string;
		amount?: string;
		payment_intent?: string;
		payment_intent_client_secret?: string;
		redirect_status?: string;
	};
	periods: any[];
	statsCardsData: {
		workflowExecutions: number;
		phaseExecutions: number;
		creditsConsumed: number;
	};
	executionStatsData: any;
	creditsUsageData: any;
	period: Period;
}

export default function HomeClient({
	searchParams,
	periods,
	statsCardsData,
	executionStatsData,
	creditsUsageData,
	period,
}: HomeClientProps) {
	const router = useRouter();
	const [showFireworks, setShowFireworks] = useState(false);
	const fireworksRef = useRef<HTMLDivElement | null>(null);
	const [amount, setAmount] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState(false);
	const hasProcessedPayment = useRef(false);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (
			searchParams.redirect_status === "succeeded" &&
			!hasProcessedPayment.current
		) {
			handlePaymentSuccess();
		} else if (searchParams.redirect_status !== "succeeded") {
			console.log("Redirect status is not succeeded, cleaning up.");
			hasProcessedPayment.current = false;
		}
	}, [searchParams.redirect_status, router]);

	const handlePaymentSuccess = async () => {
		if (searchParams.amount) {
			const amount = parseFloat(searchParams.amount);
			const price = Number((amount / 100).toFixed(2));
			setAmount(price);

			let creditsToAdd = 0;
			if (price === 9.99) {
				creditsToAdd = 1000;
			} else if (price === 19.99) {
				creditsToAdd = 2500;
			} else if (price === 49.99) {
				creditsToAdd = 7500;
			} else {
				toast.error("Invalid amount");
				return;
			}

			console.log("Credits to add:", creditsToAdd);
			try {
				const result = await UpdateUserCredits(creditsToAdd);
				if (result?.success) {
					toast.success(`${creditsToAdd} credits added to your account!`);
					hasProcessedPayment.current = true;
					setModalOpen(true);
				}
			} catch (error: Error | any) {
				toast.error("Failed to add credits: " + error.message);
			}
		}

		router.replace("/");
	};

	const closeModal = () => {
		setModalOpen(false);
		hasProcessedPayment.current = false;
		queryClient.invalidateQueries({
			queryKey: ["user-available-credits"],
		});
	};

	return (
		<div className="flex flex-1 flex-col h-full">
			<div
				ref={fireworksRef}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 10,
					display: showFireworks ? "block" : "none",
				}}
			/>
			<PaymentSuccessModal
				open={modalOpen}
				onClose={closeModal}
				amount={amount}
			/>

			<div className="flex justify-between">
				<h1 className="text-3xl font-bold">Home</h1>
				<PeriodSelector periods={periods} selectedPeriod={period} />
			</div>
			<div className="h-full py-6 flex flex-col gap-4">
				<div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
					<StatsCard
						title="Workflow executions"
						value={statsCardsData.workflowExecutions}
						icon={CirclePlayIcon}
					/>
					<StatsCard
						title="Phase executions"
						value={statsCardsData.phaseExecutions}
						icon={WaypointsIcon}
					/>
					<StatsCard
						title="Credits consumed"
						value={statsCardsData.creditsConsumed}
						icon={CoinsIcon}
					/>
				</div>

				<ExecutionStatusChart data={executionStatsData} />

				<CreditsUsageChart
					data={creditsUsageData}
					title="Daily credits spent"
					description="Daily credit consumed in selected period"
				/>
			</div>
		</div>
	);
}

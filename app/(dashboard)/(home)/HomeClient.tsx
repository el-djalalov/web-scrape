"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Period } from "@/types/analytics";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import PeriodSelector from "./_components/PeriodSelector";
import StatsCard from "./_components/StatsCard";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import CreditsUsageChart from "../billing/_components/CreditsUsageChart";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentSuccessModal from "./_components/PaymentSuccessModal";
import { UpdateUserCredits } from "@/actions/billing/updateUserCredits";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface HomeClientProps {
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
	periods,
	statsCardsData,
	executionStatsData,
	creditsUsageData,
	period,
}: HomeClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session, status } = useSession();
	const [showFireworks, setShowFireworks] = useState(false);
	const fireworksRef = useRef<HTMLDivElement | null>(null);
	const [amount, setAmount] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState(false);
	const hasProcessedPayment = useRef(false);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/sign-in");
		}
	}, [status, router]);

	const handlePaymentSuccess = useCallback(async () => {
		const amountParam = searchParams.get("amount");
		if (amountParam) {
			const amount = parseFloat(amountParam);
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
	}, [searchParams, router]);

	useEffect(() => {
		if (
			searchParams.get("redirect_status") === "succeeded" &&
			!hasProcessedPayment.current
		) {
			handlePaymentSuccess();
		}
	}, [searchParams, handlePaymentSuccess]);

	const handlePeriodChange = (period: Period) => {
		const params = new URLSearchParams(window.location.search);
		params.set("month", period.month.toString());
		params.set("year", period.year.toString());
		router.push(`/?${params.toString()}`);
	};

	const closeModal = () => {
		setModalOpen(false);
		hasProcessedPayment.current = false;
		queryClient.invalidateQueries({
			queryKey: ["user-available-credits"],
		});
	};

	if (status === "loading") {
		return <div>Loading...</div>; // Or a spinner component
	}

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
				<PeriodSelector
					periods={periods}
					selectedPeriod={period}
					onPeriodChange={handlePeriodChange}
				/>
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

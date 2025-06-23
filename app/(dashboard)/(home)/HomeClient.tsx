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
import { Fireworks } from "fireworks-js";
import PaymentSuccessModal from "./_components/PaymentSuccessModal";
import { UpdateUserCredits } from "@/actions/billing/updateUserCredits";

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
	const fireworksInstance = useRef<Fireworks | null>(null);
	const [amount, setAmount] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		if (searchParams.redirect_status === "succeeded") {
			if (searchParams.amount) {
				setAmount(parseFloat(searchParams.amount));
			}

			const updateUserCredits = async () => {
				if (amount > 0) {
					try {
						await UpdateUserCredits(amount);
					} catch (error) {
						console.error("Failed to update user credits:", error);
						toast.error(
							"Failed to update user credits. Please try again later."
						);
					}
				}
			};
			updateUserCredits();
			setModalOpen(true);

			if (fireworksRef.current) {
				fireworksInstance.current = new Fireworks(fireworksRef.current, {
					autoresize: true,
					opacity: 0.5,
					acceleration: 1.05,
					friction: 0.97,
					gravity: 1.5,
					particles: 50,
					traceLength: 3,
					traceSpeed: 10,
					explosion: 5,
					intensity: 30,
					flickering: 50,
					lineStyle: "round",
					hue: { min: 0, max: 360 },
					delay: { min: 30, max: 60 },
					rocketsPoint: { min: 50, max: 50 },
					lineWidth: {
						explosion: { min: 1, max: 3 },
						trace: { min: 1, max: 2 },
					},
					brightness: { min: 50, max: 80 },
					decay: { min: 0.015, max: 0.03 },
					mouse: {
						click: false,
						move: false,
						max: 1,
					},
				});
				fireworksInstance.current.start();
				setShowFireworks(true);
			}

			const timer = setTimeout(() => {
				if (fireworksInstance.current) {
					fireworksInstance.current.stop(true);
					setShowFireworks(false);
				}
				router.replace("/");
			}, 5000);

			return () => {
				clearTimeout(timer);
				if (fireworksInstance.current) {
					fireworksInstance.current.stop(true);
				}
			};
		}
	}, [searchParams.redirect_status, router]);

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
				onClose={() => setModalOpen(false)}
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

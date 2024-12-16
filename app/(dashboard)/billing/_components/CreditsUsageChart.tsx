"use client";

import { GetCreditsUsage } from "@/actions/analytics/GetCreditUsage";
import { GetWorkflowExecutionStats } from "@/actions/analytics/GetWorkflowExecutionStats";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import {
	ChartBarDecreasingIcon,
	ChartColumnDecreasingIcon,
	ChartColumnStackedIcon,
	TrendingUp,
} from "lucide-react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsage>>;

const chartConfig = {
	success: {
		label: "Successfull Phases Credits",
		color: "hsl(var(--chart-1))",
	},
	failed: {
		label: "Failed Phases Credits",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

function CreditsUsageChart({
	data,
	title,
	description,
}: {
	data: ChartData;
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<ChartColumnStackedIcon className="w-6 h-6 text-primary" />
					{title}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				{/* 	<pre>{JSON.stringify(data, null, 4)}</pre> */}
				<ChartContainer config={chartConfig} className="max-h-[200px] w-full">
					<BarChart accessibilityLayer data={data}>
						<defs>
							<linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-success)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-success)"
									stopOpacity={0.1}
								/>
							</linearGradient>

							<linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-failed)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-failed)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>

						<CartesianGrid vertical={false} />

						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={value => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartLegend content={<ChartLegendContent />} />

						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									className="w-[230px]"
									labelFormatter={value => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>

						<Bar
							dataKey="failed"
							radius={[0, 0, 4, 4]}
							fill="url(#fillFailed)"
							fillOpacity={0.4}
							stroke="var(--color-failed)"
							stackId="a"
						/>

						<Bar
							radius={[4, 4, 0, 0]}
							dataKey="success"
							fill="url(#fillSuccess)"
							fillOpacity={0.4}
							stroke="var(--color-success)"
							stackId="a"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default CreditsUsageChart;

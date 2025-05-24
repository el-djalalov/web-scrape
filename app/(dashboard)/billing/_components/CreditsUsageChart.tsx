"use client";

import { GetCreditsUsage } from "@/actions/analytics/GetCreditUsage";
import {
	Card,
	CardContent,
	CardDescription,
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
import { fail } from "assert";
import { ChartColumnStackedIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsage>>;
const chartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
	success: {
		label: "Successful Phases Credits",
		color: "var(--chart-success)",
	},
	failed: {
		label: "Failed Phases Credits",
		color: "var(--chart-failed)",
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
									labelFormatter={value => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
									className="w-[220px]"
								/>
							}
						/>
						<Bar
							dataKey="failed"
							stackId="a"
							radius={[0, 0, 4, 4]}
							fill="var(--color-failed)"
							fillOpacity={0.5}
							stroke="var(--color-failed)"
						/>
						<Bar
							dataKey="success"
							radius={[4, 4, 0, 0]}
							fill="var(--color-success)"
							fillOpacity={0.5}
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

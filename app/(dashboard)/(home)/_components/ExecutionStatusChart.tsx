"use client";

import { GetWorkflowExecutionStats } from "@/actions/analytics/GetWorkflowExecutionStats";

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

import { ChartSplineIcon } from "lucide-react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;

const chartConfig = {
	success: {
		label: "Success",
		color: "var(--chart-success)",
	},
	failed: {
		label: "Failed",
		color: "var(--chart-failed)",
	},
} satisfies ChartConfig;

function ExecutionStatusChart({ data }: { data: ChartData }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<ChartSplineIcon className="w-6 h-6 text-primary" />
					Workflow execution status
				</CardTitle>
				<CardDescription>
					Daily number of successfull and failed workflow executions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="max-h-[200px] w-full">
					<AreaChart accessibilityLayer data={data}>
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
						<Area
							dataKey="failed"
							type={"bump"}
							fill="url(#fillFailed)"
							fillOpacity={0.4}
							stroke="var(--color-failed)"
							stackId="a"
							min={0}
						/>

						<Area
							min={0}
							dataKey="success"
							type={"bump"}
							fill="url(#fillSuccess)"
							fillOpacity={0.4}
							stroke="var(--color-success)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default ExecutionStatusChart;

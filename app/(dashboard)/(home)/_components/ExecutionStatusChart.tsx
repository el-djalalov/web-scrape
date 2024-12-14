"use client";

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
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { TrendingUp } from "lucide-react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;

const chartConfig = {
	success: {
		label: "Success",
		color: "hsl(var(--chart-1))",
	},
	failed: {
		label: "Failed",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

function ExecutionStatusChart({ data }: { data: ChartData }) {
	console.log(data);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Workflow execution status</CardTitle>
				<CardDescription>
					Daily number of successfull and failed workflow executions
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* 	<pre>{JSON.stringify(data, null, 4)}</pre> */}
				<ChartContainer config={chartConfig} className="max-h-[200px] w-full">
					<AreaChart
						accessibilityLayer
						data={data}
						margin={{
							left: 12,
							right: 12,
						}}
					>
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
							tickFormatter={value => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>

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
			{/* 	<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							January - June 2024
						</div>
					</div>
				</div>
			</CardFooter> */}
		</Card>
	);
}

export default ExecutionStatusChart;

/* 
<AreaChart
						data={data}
						height={200}
						accessibilityLayer
						margin={{ top: 20 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={"date"}
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
							content={<ChartTooltipContent className="w-[250px]" />}
						/>
						<Area
							min={0}
							type={"bump"}
							fill="var(--color-success)"
							fillOpacity={0.7}
							stroke="var(--color-success)"
							dataKey={"success"}
							stackId={"a"}
						/>
						<Area
							min={0}
							type={"bump"}
							fill="var(--color-failed)"
							fillOpacity={0.7}
							stroke="var(--color-failed)"
							stackId={"a"}
							dataKey={"failed"}
						/>
					</AreaChart>
*/

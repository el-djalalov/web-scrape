"use client";

import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { Badge } from "@/components/ui/badge";
import { ExecutionStatusIndicator } from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { CoinsIcon, StopCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StopExecution } from "@/actions/workflows/stopExecution";
import { toast } from "sonner";
type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

function ExecutionsTable({
	workflowId,
	initialData,
}: {
	workflowId: string;
	initialData: InitialDataType;
}) {
	const router = useRouter();
	const query = useQuery({
		queryKey: ["executions", workflowId],
		initialData,
		queryFn: () => GetWorkflowExecutions(workflowId),
		refetchInterval: 5000,
	});

	const handleStopExecution = async (
		e: React.MouseEvent,
		executionId: string
	) => {
		e.stopPropagation();
		try {
			await StopExecution(executionId);
			toast.success("Execution stopped successfully");
			query.refetch();
		} catch (error) {
			toast.error("Failed to stop execution");
			console.error(error);
		}
	};

	return (
		<div className="border rounded-lg shadow-md overflow-auto">
			<Table className="h-full">
				<TableHeader className="bg-muted">
					<TableRow>
						<TableHead>Id</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Consumed</TableHead>
						<TableHead className="text-right">Started at</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className="gap-2 h-full overflow-auto">
					{query.data.map(execution => {
						const duration = DatesToDurationString(
							execution.completedAt,
							execution.startedAt
						);

						const formattedStartedAt =
							execution.startedAt &&
							formatDistanceToNow(execution.startedAt, {
								addSuffix: true,
							});

						return (
							<TableRow
								key={execution.id}
								className="cursor-pointer"
								onClick={() => {
									router.push(
										`/workflow/runs/${execution.workflowId}/${execution.id}`
									);
								}}
							>
								<TableCell>
									<div className="flex flex-col">
										<span className="font-semibold">{execution.id}</span>
										<div className="text-muted-foreground text-xs flex gap-2 items-center">
											<span>Triggered via</span>
											<Badge variant={"outline"}>{execution.trigger}</Badge>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<div className="flex gap-2 items-center">
											<ExecutionStatusIndicator
												status={execution.status as WorkflowExecutionStatus}
											/>
											<span className="font-semibold capitalize">
												{execution.status}
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											{duration}
										</div>
									</div>
								</TableCell>

								<TableCell>
									<div className="flex flex-col">
										<div className="flex gap-2 items-center">
											<CoinsIcon size={16} className="text-primary" />
											<span className="font-semibold capitalize">
												{execution.creditsConsumed}
											</span>
										</div>
										<div className="text-muted-foreground text-xs">Credits</div>
									</div>
								</TableCell>
								<TableCell className="text-right text-muted-foreground">
									{formattedStartedAt}
								</TableCell>
								<TableCell className="text-right">
									{execution.status === WorkflowExecutionStatus.RUNNING && (
										<Button
											variant="destructive"
											size="sm"
											onClick={e => handleStopExecution(e, execution.id)}
										>
											<StopCircle className="h-4 w-4 mr-1" />
											Stop
										</Button>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default ExecutionsTable;

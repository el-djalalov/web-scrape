"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
	ChevronRight,
	ClockIcon,
	CoinsIcon,
	CornerDownRight,
	FileTextIcon,
	MoreVerticalIcon,
	MoveRightIcon,
	PlayIcon,
	Settings,
	ShuffleIcon,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/TooltipWrapper";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import RunBtn from "./RunBtn";
import SchedularDialog from "./SchedularDialog";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Separator } from "@/components/ui/separator";
import {
	ExecutionStatusIndicator,
	ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog";

const statusColors = {
	[WorkflowStatus.DRAFT]: "bg-amber-400 text-yellow-600",
	[WorkflowStatus.PUBLISHED]: "bg-primary",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;
	return (
		<Card
			className={cn(
				"border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 group/card"
			)}
		>
			<CardContent className="p-4 flex items-center justify-between h-[120px]">
				<div className="flex-row items-center justify-end space-x-4 gap-4">
					<div className="flex gap-4">
						<div
							className={cn(
								"flex w-10 h-10 rounded-full items-center justify-center",
								statusColors[workflow.status as WorkflowStatus]
							)}
						>
							{isDraft ? (
								<FileTextIcon className="h-5 w-5  text-black" />
							) : (
								<PlayIcon className="h-5 w-5 text-white" />
							)}
						</div>

						<h3 className="text-base font-bold text-muted-foreground flex items-center">
							<Link
								href={`/workflow/editor/${workflow.id}`}
								className="flex items-center hover:underline"
							>
								{workflow.name}
							</Link>
						</h3>

						<DuplicateWorkflowDialog workflowId={workflow.id} />

						{/* 		{isDraft && (
							<Badge
								className="text-sm font-medium rounded-full"
								variant={"secondary"}
							>
								Draft
							</Badge>
						)} */}
					</div>

					<ScheduleSection
						cron={workflow.cron}
						workflowId={workflow.id}
						isDraft={isDraft}
						creditsCost={workflow.creditsCost}
					/>
				</div>

				<div className="flex items-center space-x-2">
					{!isDraft && <RunBtn workflowId={workflow.id} />}
					<TooltipWrapper content={workflow.description}>
						<Link
							href={`/workflow/editor/${workflow.id}`}
							className={cn(
								buttonVariants({
									variant: "outline",
									size: "sm",
								}),
								"flex items-center gap-2"
							)}
						>
							<Settings size={16} />
							Edit
						</Link>
					</TooltipWrapper>
					<WorkflowActions
						workflowName={workflow.name}
						workflowId={workflow.id}
					/>
				</div>
			</CardContent>

			<Separator />

			<LastRunDetails workflow={workflow} />
		</Card>
	);
}

function WorkflowActions({
	workflowName,
	workflowId,
}: {
	workflowName: string;
	workflowId: string;
}) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	return (
		<>
			<DeleteWorkflowDialog
				open={showDeleteDialog}
				setOpen={setShowDeleteDialog}
				workflowName={workflowName}
				workflowId={workflowId}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"outline"} size={"sm"}>
						{/* <div className="flex items-center justify-center w-full h-full"> */}
						{/* 	<TooltipWrapper content={"More actions"}> */}
						<MoreVerticalIcon size={18} />
						{/* </TooltipWrapper> */}
						{/* 	</div> */}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive flex items-center gap-2"
						onSelect={() => {
							setShowDeleteDialog(prev => !prev);
						}}
					>
						<TrashIcon size={16} />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

function ScheduleSection({
	isDraft,
	creditsCost,
	workflowId,
	cron,
}: {
	cron: string | null;
	isDraft: boolean;
	creditsCost: number;
	workflowId: string;
}) {
	if (isDraft) {
		return null;
	}

	return (
		<div className="flex items-center gap-2 pl-12 pt-2">
			<CornerDownRight className="h-4 w-4 text-muted-foreground" />
			<SchedularDialog
				workflowId={workflowId}
				cron={cron}
				key={`${cron}-${workflowId}`}
			/>
			<MoveRightIcon className="h-4 w-4 text-muted-foreground" />
			<TooltipWrapper content="Credit consumption for full run">
				<div className="flex items-center gap-3">
					<Badge
						variant={"outline"}
						className="space-x-2 text-muted-foreground rounded-sm p-1"
					>
						<CoinsIcon className="h-4 w-4" />
						<span className="text-sm ">{creditsCost}</span>
					</Badge>
				</div>
			</TooltipWrapper>
		</div>
	);
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
	const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
	const formattedStartedAt =
		lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
	const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
	const nextScheduleUtc =
		nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

	const isDraft = workflow.status === WorkflowStatus.DRAFT;
	if (isDraft) return null;
	return (
		<div className="flex bg-primary/5 px-4 py-1 justify-between items-center text-muted-foreground">
			<div className="">
				{lastRunAt && (
					<Link
						href={`/workflow/runs/${workflow.id}/${lastRunId}`}
						className="flex items-center text-sm gap-2 group"
					>
						<span>Last run: </span>
						<ExecutionStatusIndicator
							status={lastRunStatus as WorkflowExecutionStatus}
						/>
						<ExecutionStatusLabel
							status={lastRunStatus as WorkflowExecutionStatus}
						/>
						<span>{formattedStartedAt}</span>
						<ChevronRight
							size={14}
							className="-translate-x-[4px] group-hover:translate-x-0 transition"
						/>
					</Link>
				)}

				{!lastRunAt && <div>No runs yet</div>}
			</div>
			{nextRunAt && (
				<div className="flex items-center text-sm gap-2">
					<ClockIcon size={16} />
					<span className="text-xs">Next run at:</span>
					<span className="text-xs">{nextSchedule}</span>
					<span className="text-xs">({nextScheduleUtc} UTC)</span>
				</div>
			)}
		</div>
	);
}

export default WorkflowCard;

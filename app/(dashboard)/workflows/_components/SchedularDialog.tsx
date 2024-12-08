"use client";

import React, { useEffect, useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { Calendar1Icon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { RemoveWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@radix-ui/react-dropdown-menu";

function SchedularDialog(props: { workflowId: string; cron: string | null }) {
	const [cron, setCron] = useState(props.cron || "");
	const [validCron, setValidCron] = useState(false);
	const [readableCron, setReadableCron] = useState("");

	const mutation = useMutation({
		mutationFn: UpdateWorkflowCron,
		onSuccess: () => {
			toast.success("Schedule updated successfully", { id: "cron" });
		},
		onError: () => {
			toast.error("Something went wrong", { id: "cron" });
		},
	});

	const removeSchedulerMutation = useMutation({
		mutationFn: RemoveWorkflowSchedule,
		onSuccess: () => {
			toast.success("Schedule removed successfully", { id: "remove-cron" });
		},
		onError: () => {
			toast.error("Something went wrong", { id: "remove-cron" });
		},
	});

	useEffect(() => {
		try {
			parser.parseExpression(cron);
			const humanCronStr = cronstrue.toString(cron);
			setValidCron(true);
			setReadableCron(humanCronStr);
		} catch (error) {
			setValidCron(false);
		}
	}, [cron]);

	const workflowHasValidCron = props.cron && props.cron.length > 0;
	const readableSavedCron =
		workflowHasValidCron && cronstrue.toString(props.cron!);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant={"secondary"}
					size={"sm"}
					className={cn(
						"text-sm py-1 h-auto text-orange-500 rounded-full",
						workflowHasValidCron && "text-white"
					)}
				>
					{workflowHasValidCron && (
						<div className="flex items-center gap-2">
							<ClockIcon />
							{readableSavedCron}
						</div>
					)}

					{!workflowHasValidCron && (
						<div className="flex items-center gap-1">
							<TriangleAlertIcon className="h-3 w-3 " />
							Set schedule
						</div>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent aria-describedby="Dialog content" className="px-0">
				<CustomDialogHeader
					title="Schedule workflow execution"
					icon={Calendar1Icon}
				/>
				<div className="px-6 pb-4 space-y-4">
					<DialogDescription className="text-muted-foreground text-sm">
						Specify a cron expression to schedule a periodic workflow execution.
						All times are in UTC
					</DialogDescription>
					<Input
						placeholder="e.g.  * * * * *"
						value={cron}
						onChange={e => setCron(e.target.value)}
					/>
					<div
						className={cn(
							"bg-accent rounded-md p-2 text-sm border-destructive text-destructive border",
							validCron && "border-primary text-primary"
						)}
					>
						{validCron ? readableCron : "Not a valid cron expression"}
					</div>

					{workflowHasValidCron && (
						<DialogClose asChild>
							<div>
								<Button
									variant={"outline"}
									className="w-full text-destructive border-destructive"
									onClick={() => {
										toast.loading("Removing schedule...", {
											id: "remove-cron",
										});
										removeSchedulerMutation.mutate(props.workflowId);
									}}
									disabled={
										mutation.isPending || removeSchedulerMutation.isPending
									}
								>
									Remove current schedule
								</Button>
							</div>
						</DialogClose>
					)}
					<Separator />
				</div>
				<DialogFooter className="px-6 gap-2">
					<DialogClose asChild>
						<Button className="w-full" variant={"secondary"}>
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							className="w-full"
							disabled={mutation.isPending || !validCron}
							onClick={() => {
								toast.loading("Saving... ", { id: "cron" });
								mutation.mutate({
									id: props.workflowId,
									cron,
								});
							}}
						>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default SchedularDialog;

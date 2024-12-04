"use client";

import { PublishWorkFlow } from "@/actions/workflows/publishWorkFlow";
import { RunWorkFlow } from "@/actions/workflows/runWorkFlow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function PublishBtn({ workflowId }: { workflowId: string }) {
	const generate = useExecutionPlan();

	const { toObject } = useReactFlow();

	const mutation = useMutation({
		mutationFn: PublishWorkFlow,
		onSuccess: () => {
			toast.success("Workflow published", { id: "workflowId" });
		},
		onError: () => {
			toast.error("Something went wrong", { id: "workflowId" });
		},
	});
	return (
		<Button
			size={"sm"}
			variant={"secondary"}
			className="flex items-center gap-2 hover:!bg-inherit-200/90 border"
			disabled={mutation.isPending}
			onClick={() => {
				const plan = generate();

				if (!plan) {
					//TODO client side validation
					return;
				}
				toast.loading("Publishing workflow...", { id: "workflowId" });
				mutation.mutate({
					id: workflowId,
					flowDefination: JSON.stringify(toObject()),
				});
			}}
		>
			<UploadIcon size={16} className="stroke-green-400" />
			Publish
		</Button>
	);
}

export default PublishBtn;

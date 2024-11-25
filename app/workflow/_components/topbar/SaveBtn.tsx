"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveBtn({ workflowId }: { workflowId: string }) {
	const { toObject } = useReactFlow();

	const saveMutation = useMutation({
		mutationFn: UpdateWorkflow,
		onSuccess: () => {
			toast.success("Flow saved successfully", { id: "save-workflow" });
		},
		onError: () => {
			toast.success("Somtheing went wrong", { id: "save-workflow" });
		},
	});
	return (
		<Button
			size={"sm"}
			disabled={saveMutation.isPending}
			variant={"secondary"}
			className="flex items-center gap-2 hover:!bg-inherit-200/90 border"
			onClick={() => {
				const workflowDefination = JSON.stringify(toObject());
				toast.loading("Saving worklfow...", { id: "save-workflow" });
				saveMutation.mutate({
					id: workflowId,
					defination: workflowDefination,
				});
			}}
		>
			<CheckIcon size={16} className="stroke-green-400" />
			Save
		</Button>
	);
}

export default SaveBtn;

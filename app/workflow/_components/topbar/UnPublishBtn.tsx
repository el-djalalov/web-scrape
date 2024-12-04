"use client";

import { UnPublishWorkflow } from "@/actions/workflows/unPublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ReplyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function UnPublishBtn({ workflowId }: { workflowId: string }) {
	const mutation = useMutation({
		mutationFn: UnPublishWorkflow,
		onSuccess: () => {
			toast.success("Workflow unpublished", { id: "workflowId" });
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
				toast.loading("Unpublishing workflow...", { id: "workflowId" });
				mutation.mutate(workflowId);
			}}
		>
			<ReplyIcon size={16} className="stroke-green-400" />
			Unpublish
		</Button>
	);
}

export default UnPublishBtn;

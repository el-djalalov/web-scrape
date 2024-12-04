"use client";

import { RunWorkFlow } from "@/actions/workflows/runWorkFlow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function RunBtn({ workflowId }: { workflowId: string }) {
	const mutation = useMutation({
		mutationFn: RunWorkFlow,
		onSuccess: () => {
			toast.success("Workflow started", { id: workflowId });
		},
		onError: () => {
			toast.error("Somethign went wrong", { id: workflowId });
		},
	});

	return (
		<Button
			variant={"outline"}
			className="flex items-center gap-2"
			size={"sm"}
			disabled={mutation.isPending}
			onClick={() => {
				toast.loading("Scheduling run...", { id: workflowId });

				mutation.mutate({
					workflowId,
				});
			}}
		>
			<PlayIcon size={16} />
			Run
		</Button>
	);
}

export default RunBtn;

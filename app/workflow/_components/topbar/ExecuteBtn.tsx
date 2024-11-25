"use client";

import { RunWorkFlow } from "@/actions/workflows/runWorkFlow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
	const generate = useExecutionPlan();

	const { toObject } = useReactFlow();

	const mutation = useMutation({
		mutationFn: RunWorkFlow,
		onSuccess: () => {
			toast.success("Execution started", { id: "flow-execution" });
		},
		onError: () => {
			toast.error("Something went wrong", { id: "flow-execution" });
		},
	});
	return (
		<Button
			size={"sm"}
			variant={"outline"}
			className="flex items-center gap-2 !bg-green-400  hover:!bg-green-400/80 dark:text-black border"
			disabled={mutation.isPending}
			onClick={() => {
				const plan = generate();

				if (!plan) {
					//TODO client side validation
					return;
				}

				mutation.mutate({
					workflowId: workflowId,
					flowDefination: JSON.stringify(toObject()),
				});
			}}
		>
			<PlayIcon size={16} className="stroke-black" />
			Execute
		</Button>
	);
}

export default ExecuteBtn;

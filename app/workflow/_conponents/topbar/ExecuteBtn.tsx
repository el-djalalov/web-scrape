"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import React from "react";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
	return (
		<Button
			variant={"outline"}
			className="flex items-center gap-2 !bg-green-400  hover:!bg-green-400/80 dark:text-black border"
		>
			<PlayIcon size={16} className="stroke-black" />
			Execute
		</Button>
	);
}

export default ExecuteBtn;

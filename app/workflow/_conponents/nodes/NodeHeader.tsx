"use client";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function NodeHeader({ taskType }: { taskType: TaskType }) {
	const task = TaskRegistry[taskType];
	return (
		<div className="flex items-center gap-2 p-2">
			<task.icon size={16} />
			<div className="flex justify-between items-center w-full">
				<p className="text-xs font-bold uppercase text-muted-foreground">
					{task.label}
				</p>
				<div className="flex gap-1 items-center">
					{task.isEntryPoint && <Badge>Entry point</Badge>}
					<Badge className="gap-2 flex items-center text-xs">
						<CoinsIcon size={16} />
						TODO
					</Badge>
					{!task.isEntryPoint && (
						<>
							<Button variant={"ghost"} size={"sm"}>
								<TrashIcon size={12} className="text-red-500" />
							</Button>
							<Button variant={"ghost"} size={"icon"}>
								<CopyIcon size={12} />
							</Button>
						</>
					)}
					<Button
						variant={"ghost"}
						size={"icon"}
						className="drag-handle cursor-grab"
					>
						<GripVerticalIcon size={20} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default NodeHeader;

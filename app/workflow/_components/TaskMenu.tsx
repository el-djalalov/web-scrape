"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";

export default function TaskMenu() {
	return (
		<aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={["extraction", "interactions", "timing", "results"]}
			>
				<AccordionItem value="interactions">
					<AccordionTrigger className="font-bold">
						User interactions
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuBtn taskType={TaskType.FILL_INPUT} />
						<TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="extraction">
					<AccordionTrigger className="font-bold">
						Data extraction
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
						<TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
						<TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="timing">
					<AccordionTrigger className="font-bold">
						Timing controls
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="results">
					<AccordionTrigger className="font-bold">
						Result delivery
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	);
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
	const onDragstart = (e: React.DragEvent, type: TaskType) => {
		e.dataTransfer.setData("application/reactflow", type);
		e.dataTransfer.effectAllowed = "move";
	};
	const task = TaskRegistry[taskType];
	return (
		<Button
			variant={"secondary"}
			className="flex justify-start items-center w-full border"
			draggable
			onDragStart={e => onDragstart(e, taskType)}
		>
			<div className="flex gap-2 items-center">
				<task.icon size={20} />
				{task.label}
			</div>
		</Button>
	);
}

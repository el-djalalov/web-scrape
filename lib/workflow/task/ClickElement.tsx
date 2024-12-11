import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { MousePointerClickIcon } from "lucide-react";

export const ClickElementTask = {
	type: TaskType.CLICK_ELEMENT,
	label: "Click element",
	icon: props => (
		<MousePointerClickIcon className="stroke-orange-500 w-5 h-5" {...props} />
	),
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INTANCE,
			required: true,
		},
		{
			name: "Selector",
			type: TaskParamType.STRING,
			required: true,
		},
	] as const,
	outputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INTANCE,
		},
	] as const,
} satisfies WorkflowTask;

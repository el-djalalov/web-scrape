import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon } from "lucide-react";

export const ScrollToElementTask = {
	type: TaskType.SCROLL_TO_ELELEMENT,
	label: "Scroll to element",
	icon: props => (
		<ArrowUpIcon className="stroke-orange-500 w-5 h-5" {...props} />
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

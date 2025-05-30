import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon } from "lucide-react";

export const WaitForElementTask = {
	type: TaskType.WAIT_FOR_ELEMENT,
	label: "Wait for element",
	icon: props => <EyeIcon className="stroke-amber-500 w-5 h-5" {...props} />,
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
		{
			name: "Visibility",
			type: TaskParamType.SELECT,
			hideHandle: true,
			required: true,
			options: [
				{ label: "Visable", value: "Visable" },
				{ label: "Hidden", value: "Hidden" },
			],
		},
	] as const,
	outputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INTANCE,
		},
	] as const,
} satisfies WorkflowTask;

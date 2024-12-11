import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, Edit3Icon, GlobeIcon, LucideProps } from "lucide-react";

export const FillInputTask = {
	type: TaskType.FILL_INPUT,
	label: "Fill Input",
	icon: props => <Edit3Icon className="stroke-orange-500 w-5 h-5" {...props} />,
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
			name: "Value",
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

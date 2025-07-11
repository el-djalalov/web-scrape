import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
	type: TaskType.PAGE_TO_HTML,
	label: "Get html from page",
	icon: (props: LucideProps) => (
		<CodeIcon className="stroke-green-500 w-5 h-5" {...props} />
	),
	isEntryPoint: false,
	credits: 2,
	inputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INTANCE,
			required: true,
		},
	] as const,
	outputs: [
		{
			name: "Html",
			type: TaskParamType.STRING,
		},
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INTANCE,
		},
	] as const,
} satisfies WorkflowTask;

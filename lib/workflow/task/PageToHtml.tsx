import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
	type: TaskType.PAGE_TO_HTML,
	label: "Get html from page",
	icon: (props: LucideProps) => (
		<CodeIcon className="stroke-blue-400" {...props} />
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

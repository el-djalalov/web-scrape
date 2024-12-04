import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
	type: TaskType.LAUNCH_BROWSER,
	label: "Launch browser",
	icon: (props: LucideProps) => (
		<GlobeIcon className="stroke-green-500 w-5 h-5" {...props} />
	),
	isEntryPoint: true,
	credits: 5,
	inputs: [
		{
			name: "Website Url",
			type: TaskParamType.STRING,
			helperText: "eg: http://www.google.com",
			required: true,
			hideHandle: true,
		},
	] as const,
	outputs: [{ name: "Web page", type: TaskParamType.BROWSER_INTANCE }] as const,
} satisfies WorkflowTask;

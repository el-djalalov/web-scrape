import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon, MousePointerClickIcon } from "lucide-react";

export const NavigateUrlTask = {
	type: TaskType.NAVIGATE_URL,
	label: "Navigate URL",
	icon: props => <Link2Icon className="stroke-orange-500 w-5 h-5" {...props} />,
	isEntryPoint: false,
	credits: 2,
	inputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INTANCE,
			required: true,
		},
		{
			name: "URL",
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

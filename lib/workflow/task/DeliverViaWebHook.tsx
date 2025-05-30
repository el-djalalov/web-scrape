import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { SendIcon } from "lucide-react";

export const DeliverViaWebHookTask = {
	type: TaskType.DELIVER_VIA_WEBHOOK,
	label: "Deliver via Webhook",
	icon: props => <SendIcon className="stroke-blue-500 w-5 h-5" {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: "Target URL",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "Body",
			type: TaskParamType.STRING,
			required: true,
		},
	] as const,
	outputs: [] as const,
} satisfies WorkflowTask;

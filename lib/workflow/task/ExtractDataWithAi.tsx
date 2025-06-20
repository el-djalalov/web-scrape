import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAiTask = {
	type: TaskType.EXTRACT_DATA_WITH_AI,
	label: "Extract Data With Ai",
	icon: props => <BrainIcon className="stroke-green-500 w-5 h-5" {...props} />,
	isEntryPoint: false,
	credits: 3,
	inputs: [
		{
			name: "Content",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "Credentials",
			type: TaskParamType.CREDENTIAL,
			required: true,
		},
		{
			name: "Prompt",
			type: TaskParamType.STRING,
			required: true,
			variant: "textarea",
		},
	] as const,
	outputs: [
		{
			name: "Extracted data",
			type: TaskParamType.STRING,
		},
	] as const,
} satisfies WorkflowTask;

import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon } from "lucide-react";

export const AddProprertyToJSONTask = {
	type: TaskType.ADD_PROPERTY_TO_JSON,
	label: "Add proprty to JSON",
	icon: props => (
		<DatabaseIcon className="stroke-rose-500 w-5 h-5" {...props} />
	),
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: "JSON",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "Property name",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "Property value",
			type: TaskParamType.STRING,
			required: true,
		},
	] as const,
	outputs: [
		{
			name: "Update JSON",
			type: TaskParamType.STRING,
		},
	] as const,
} satisfies WorkflowTask;

import { TaskParamType } from "@/types/task";

export const ColorForHandle: Record<TaskParamType, string> = {
	[TaskParamType.BROWSER_INTANCE]: "!bg-primary",
	STRING: "!bg-amber-400",
	SELECT: "!bg-rose-400",
};

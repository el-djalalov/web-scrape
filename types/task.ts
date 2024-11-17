export enum TaskType {
	LAUNCH_BROWSER = "LAUNCH_BROWSER",
	PAGE_TO_HTML = "PAGE_TO_HTML",
}
export enum TaskParamType {
	STRING = "STRING",
	BROWSER_INTANCE = "BROWSER_INTANCE",
}

export interface TaskParam {
	name: string;
	type: TaskParamType;
	helperText?: string;
	required?: boolean;
	hideHandle?: boolean;
	value?: string;
	[key: string]: any;
}

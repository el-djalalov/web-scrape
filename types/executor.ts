import { Browser, Page } from "puppeteer-core";
import { WorkflowTask } from "./workflow";
import { LogCollector } from "./log";

export type Environment = {
	browser?: Browser;
	phases: {
		[key: string]: {
			inputs: Record<string, string>;
			outputs: Record<string, string>;
		};
	};
	page?: Page;
};

export type ExecutionEnvironment<T extends WorkflowTask> = {
	getInput(name: T["inputs"][number]["name"]): string;
	setOutput(name: T["outputs"][number]["name"], value: string): void;
	getBrowser(): Browser | undefined;
	setBrowser(browser: Browser): void;
	getPage(): Page | undefined;
	setPage(page: Page): void;

	log: LogCollector;
};

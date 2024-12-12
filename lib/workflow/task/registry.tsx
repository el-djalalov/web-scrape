import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElements";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FillInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebHookTask } from "./DeliverViaWebHook";
import { ExtractDataWithAiTask } from "./ExtractDataWithAi";

type Registry = {
	[K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
	FILL_INPUT: FillInputTask,
	CLICK_ELEMENT: ClickElementTask,
	WAIT_FOR_ELEMENT: WaitForElementTask,
	DELIVER_VIA_WEBHOOK: DeliverViaWebHookTask,
	EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask,
};

import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";

export async function ScrollToElementExecutor(
	environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
	try {
		const selector = environment.getInput("Selector");
		if (!selector) {
			environment.log.error("input->selector not defined");
		}

		await environment.getPage()!.evaluate(selector => {
			const elem = document.querySelector(selector);

			if (!elem) {
				throw new Error("Element not found");
			}

			const top = elem.getBoundingClientRect().top + window.screenY;
			window.scrollTo({ top: top });
		}, selector);
		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}

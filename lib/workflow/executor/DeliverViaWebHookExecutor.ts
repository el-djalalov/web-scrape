import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHook";

export async function DeliverViaWebHookExecutor(
	environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>
): Promise<boolean> {
	try {
		const targetUrl = environment.getInput("Target URL");
		if (!targetUrl) {
			environment.log.error("input->targetUrl not defined");
		}
		const body = environment.getInput("Body");
		if (!body) {
			environment.log.error("input->body not defined");
		}
		const res = await fetch(targetUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const statusCode = res.status;

		if (statusCode !== 200) {
			environment.log.error(`Status code ${statusCode}`);
			return false;
		}

		const responseBody = await res.json();
		environment.log.info(JSON.stringify(responseBody, null, 4));
		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}

import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHook";

export async function DeliverViaWebHookExecutor(
	environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>
): Promise<boolean> {
	const targetUrl = environment.getInput("Target URL");
	const body = environment.getInput("Body");

	if (!targetUrl) {
		environment.log.error("Webhook target URL not defined.");
		return false;
	}

	if (!body) {
		environment.log.error("Webhook body not defined.");
		return false;
	}

	try {
		environment.log.info(`Attempting to deliver webhook to: ${targetUrl}`);
		environment.log.info(`Webhook body: ${JSON.stringify(body)}`);

		const res = await fetch(targetUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const statusCode = res.status;

		if (statusCode !== 200) {
			environment.log.error(`Webhook delivery failed with status code: ${statusCode}`);
			const errorText = await res.text();
			environment.log.error(`Webhook response: ${errorText}`);
			return false;
		}

		const responseBody = await res.json();
		environment.log.info(`Webhook delivered successfully. Response: ${JSON.stringify(responseBody, null, 4)}`);
		return true;
	} catch (error: any) {
		environment.log.error(`Error delivering webhook: ${error.message}`);
		environment.log.error(`Full error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
		return false;
	}
}

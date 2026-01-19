import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHook";
import { validateUrl } from "@/lib/utils/urlValidation";

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

	// Validate URL to prevent SSRF attacks
	const urlValidation = validateUrl(targetUrl);
	if (!urlValidation.valid) {
		environment.log.error(`Invalid webhook URL: ${urlValidation.error}`);
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

		if (statusCode < 200 || statusCode >= 300) {
			environment.log.error(`Webhook delivery failed with status code: ${statusCode}`);
			const errorText = await res.text();
			environment.log.error(`Webhook response: ${errorText}`);
			return false;
		}

		// Try to parse JSON response, but don't fail if it's not JSON
		let responseBody: unknown;
		const contentType = res.headers.get("content-type");
		if (contentType?.includes("application/json")) {
			responseBody = await res.json();
		} else {
			responseBody = await res.text();
		}

		environment.log.info(`Webhook delivered successfully. Response: ${JSON.stringify(responseBody, null, 2)}`);
		return true;
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		environment.log.error(`Error delivering webhook: ${message}`);
		return false;
	}
}

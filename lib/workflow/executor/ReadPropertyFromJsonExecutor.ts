import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";
import { safeJsonParse } from "@/lib/utils/safeJsonParse";

export async function ReadPropertyFromJsonExecutor(
	environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> {
	try {
		const jsonData = environment.getInput("JSON");
		if (!jsonData) {
			environment.log.error("input->JSON not defined");
			return false;
		}

		const propertyName = environment.getInput("Property name");
		if (!propertyName) {
			environment.log.error("input->propertyName not defined");
			return false;
		}

		const json = safeJsonParse<Record<string, unknown>>(jsonData);
		if (!json) {
			environment.log.error("Failed to parse JSON: invalid format");
			return false;
		}

		const propertyValue = json[propertyName];
		if (propertyValue === undefined) {
			environment.log.error("Property not found");
			return false;
		}
		environment.setOutput(
			"Property value",
			typeof propertyValue === "string" ? propertyValue : JSON.stringify(propertyValue)
		);

		return true;
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		environment.log.error(message);
		return false;
	}
}

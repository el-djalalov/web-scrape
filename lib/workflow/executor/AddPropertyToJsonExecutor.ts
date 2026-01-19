import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJSONTask } from "../task/AddPropertyToJSON";
import { safeJsonParse } from "@/lib/utils/safeJsonParse";

export async function AddPropertyToJsonExecutor(
	environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
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

		const propertyValue = environment.getInput("Property value");
		if (!propertyValue) {
			environment.log.error("input->propertyValue not defined");
			return false;
		}

		const json = safeJsonParse<Record<string, unknown>>(jsonData);
		if (!json) {
			environment.log.error("Failed to parse JSON: invalid format");
			return false;
		}

		json[propertyName] = propertyValue;
		environment.setOutput("Update JSON", JSON.stringify(json));

		return true;
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		environment.log.error(message);
		return false;
	}
}

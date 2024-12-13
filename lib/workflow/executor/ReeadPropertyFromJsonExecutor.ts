import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";

export async function ReeadPropertyFromJsonExecutor(
	environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> {
	try {
		const jsonData = environment.getInput("JSON");
		if (!jsonData) {
			environment.log.error("input->JSON not defined");
		}

		const propertyName = environment.getInput("Property name");
		if (!propertyName) {
			environment.log.error("input->propertyName not defined");
		}

		const json = JSON.parse(jsonData);

		const propertyValue = json[propertyName];
		if (!propertyValue) {
			environment.log.error("Property not found");
			return false;
		}
		environment.setOutput("Property value", propertyValue);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}

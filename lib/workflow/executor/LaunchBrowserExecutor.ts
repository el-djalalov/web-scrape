import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
	environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
	let browser;
	try {
		const websiteUrl = environment.getInput("Website Url");
		browser = await puppeteer.launch({ headless: false }); // This will keep browser open
		await waitFor(3000);
	} catch (error) {
		console.log(error);
		return false;
	} finally {
		browser?.close();
	}
	return true;
}

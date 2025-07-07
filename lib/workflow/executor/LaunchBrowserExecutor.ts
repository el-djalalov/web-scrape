import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer-core";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
	environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
	let browser;
	try {
		const websiteUrl = environment.getInput("Website Url");

		// Configure browser options based on environment
		const browserOptions = await getBrowserOptions();

		browser = await puppeteer.launch(browserOptions);
		environment.log.info("Browser started successfully");
		environment.setBrowser(browser);

		const page = await browser.newPage();
		await page.goto(websiteUrl, { waitUntil: "networkidle0" });
		environment.setPage(page);
		environment.log.info(`Opened page at: ${websiteUrl}`);

		return true;
	} catch (error: any) {
		environment.log.error(`Browser launch failed: ${error.message}`);
		if (browser) {
			await browser.close();
		}
		return false;
	}
}

async function getBrowserOptions() {
	if (process.env.NODE_ENV === "development") {
		// Local development configuration
		return {
			executablePath: getLocalChromePath(),
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-accelerated-2d-canvas",
				"--no-first-run",
				"--no-zygote",
				"--disable-gpu",
			],
		};
	} else {
		// Production configuration with chromium-min
		const chromium = await import("@sparticuz/chromium-min");

		return {
			args: [
				...chromium.default.args,
				"--hide-scrollbars",
				"--disable-web-security",
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-gpu",
				"--single-process",
				"--no-zygote",
			],
			executablePath: await chromium.default.executablePath(
				// Use the CDN URL for the chromium binary
				"https://github.com/Sparticuz/chromium/releases/download/v137.0.1/chromium-v137.0.1-pack.tar"
			),
			headless: true,
			ignoreHTTPSErrors: true,
		};
	}
}

function getLocalChromePath(): string {
	const platform = process.platform;

	switch (platform) {
		case "win32": {
			const windowsPaths = [
				"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
				"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
				process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
			];

			for (const path of windowsPaths) {
				try {
					const fs = require("fs");
					if (fs.existsSync(path)) {
						return path;
					}
				} catch (e) {
					// Continue to next path
				}
			}
			throw new Error("Chrome executable not found on Windows");
		}

		case "darwin": {
			const macPaths = [
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/Applications/Chromium.app/Contents/MacOS/Chromium",
			];

			for (const path of macPaths) {
				try {
					const fs = require("fs");
					if (fs.existsSync(path)) {
						return path;
					}
				} catch (e) {
					// Continue to next path
				}
			}
			throw new Error("Chrome executable not found on macOS");
		}

		case "linux": {
			const linuxPaths = [
				"/usr/bin/google-chrome",
				"/usr/bin/google-chrome-stable",
				"/usr/bin/chromium-browser",
				"/usr/bin/chromium",
			];

			for (const path of linuxPaths) {
				try {
					const fs = require("fs");
					if (fs.existsSync(path)) {
						return path;
					}
				} catch (e) {
					// Continue to next path
				}
			}
			throw new Error("Chrome executable not found on Linux");
		}

		default:
			throw new Error(`Unsupported platform: ${platform}`);
	}
}

import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// Static metadata for the application
export const metadata: Metadata = {
	title: {
		template: "%s | Web Scrape",
		default: "Web Scrape - Workflow Automation Platform",
	},
	description:
		"A powerful web scraping and workflow automation platform. Create, manage, and schedule automated workflows with ease.",
	applicationName: "Web Scrape",
	keywords: [
		"web scraping",
		"automation",
		"workflow",
		"scraper",
		"data extraction",
		"puppeteer",
	],
	authors: [{ name: "Web Scrape Team" }],
	creator: "Web Scrape",
	openGraph: {
		type: "website",
		locale: "en_US",
		title: "Web Scrape - Workflow Automation Platform",
		description:
			"A powerful web scraping and workflow automation platform. Create, manage, and schedule automated workflows with ease.",
		siteName: "Web Scrape",
	},
	twitter: {
		card: "summary_large_image",
		title: "Web Scrape - Workflow Automation Platform",
		description:
			"A powerful web scraping and workflow automation platform. Create, manage, and schedule automated workflows with ease.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(inter.className, "antialiased")}>
				<SessionProvider>
					<AppProviders>{children}</AppProviders>
					<Toaster richColors />
				</SessionProvider>
			</body>
		</html>
	);
}

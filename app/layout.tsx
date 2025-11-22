import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

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

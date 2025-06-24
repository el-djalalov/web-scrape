import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			signUpForceRedirectUrl={"/setup"}
			afterSignOutUrl={"/sign-in"}
			appearance={{
				elements: {
					formButtonPrimary:
						"bg-primary hover:bg-primary/90 text-sm !shadow-none",
				},
			}}
		>
			<html lang="en">
				<body className={cn(inter.className, "antialiased")}>
					<AppProviders>{children}</AppProviders>
					<Toaster richColors />
				</body>
			</html>
		</ClerkProvider>
	);
}

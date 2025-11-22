import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-8">
			<Logo iconSize={40} fontSize={"text-5xl"} />
			{children}
		</div>
	);
}

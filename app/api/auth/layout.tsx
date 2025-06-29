import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<Logo iconSize={40} fontSize={"text-5xl"} />
			{children}
		</div>
	);
}

export default layout;

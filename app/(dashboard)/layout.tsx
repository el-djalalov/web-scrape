"use client";

import React from "react";
import BreadCrumbHeader from "@/components/BreadCrumbHeader";
import DesktopSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<DesktopSidebar />
			<div className="flex flex-col flex-1 min-h-screen">
				<header className="flex items-center justify-between px-6 py-6 h-[68px] container">
					<BreadCrumbHeader />
					<div className="gap-4 flex items-center">
						<ModeToggle />
					</div>
				</header>
				<Separator />
				<div className="overflow-auto">
					<div className="flex-1 container py-4 text-sidebar-accent-foreground">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export default layout;

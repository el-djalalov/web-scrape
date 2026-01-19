"use client";

import React from "react";
import BreadCrumbHeader from "@/components/BreadCrumbHeader";
import DesktopSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/components/UserButton";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Skip to main content
			</a>
			<DesktopSidebar />
			<div className="flex flex-col flex-1 min-h-screen">
				<header className="flex items-center justify-between px-6 py-6 h-[68px] container">
					<BreadCrumbHeader />
					<div className="gap-4 flex items-center">
						<ModeToggle />
						<UserButton />
					</div>
				</header>
				<Separator />
				<div className="overflow-auto">
					<main
						id="main-content"
						className="flex-1 container py-4 text-sidebar-accent-foreground"
						tabIndex={-1}
					>
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}

export default layout;

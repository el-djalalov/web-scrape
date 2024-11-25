"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavigationTabs({ workflowId }: { workflowId: string }) {
	const pathname = usePathname();
	const activeValue = pathname?.split("/")[2];

	return (
		<div className="absolute left-1/2 transform -translate-x-1/2">
			<Tabs
				value={activeValue}
				className="w-[400px] items-center justify-center"
			>
				<TabsList className="grid w-full grid-cols-2">
					<Link href={`/workflow/editor/${workflowId}`}>
						<TabsTrigger value="editor" className="w-full">
							Editor
						</TabsTrigger>
					</Link>
					<Link href={`/workflow/runs/${workflowId}`}>
						<TabsTrigger value="runs" className="w-full">
							Runs
						</TabsTrigger>
					</Link>
				</TabsList>
			</Tabs>
		</div>
	);
}

export default NavigationTabs;

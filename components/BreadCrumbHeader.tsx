"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { MobileSideBar } from "./Sidebar";

function BreadCrumbHeader() {
	const pathName = usePathname();
	const paths = pathName === "/" ? [""] : pathName.split("/");
	return (
		<div className="flex items-center">
			<MobileSideBar />
			<Breadcrumb>
				<BreadcrumbList>
					{paths.map((path, index) => (
						<React.Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink className="capitalize" href={`/${path}`}>
									{path === "" ? "home" : path}
								</BreadcrumbLink>
							</BreadcrumbItem>
							{index !== paths.length - 1 && <BreadcrumbSeparator />}
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}

export default BreadCrumbHeader;

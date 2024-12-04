"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";
import NavigationTabs from "./NavigationTabs";
import PublishBtn from "./PublishBtn";
import UnPublishBtn from "./UnPublishBtn";

interface Props {
	title: string;
	subtitle?: string;
	workflowId: string;
	hideButtons?: boolean;
	isPublished?: boolean;
}

function Topbar({
	title,
	subtitle,
	workflowId,
	hideButtons = false,
	isPublished = false,
}: Props) {
	const router = useRouter();
	return (
		<header className="flex px-4 py-2 border-b-2 border-separate justify-between w-full h-[60px]! sticky top-0 bg-background z-10">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center justify-center gap-2">
					<Button
						variant={"secondary"}
						size={"sm"}
						onClick={() => router.back()}
					>
						<ChevronLeftIcon size={20} />
						Back
					</Button>
					<div className="flex flex-col pl-2">
						<p className="font-bold text-ellipsis truncate">{title}</p>

						{subtitle && (
							<p className="text-sm text-muted-foreground truncate text-ellipsis">
								{subtitle}
							</p>
						)}
					</div>
				</div>
				<NavigationTabs workflowId={workflowId} />
				<div className="flex gap-2">
					{!hideButtons && (
						<>
							<ExecuteBtn workflowId={workflowId} />
							{isPublished && <UnPublishBtn workflowId={workflowId} />}
							{!isPublished && (
								<>
									<SaveBtn workflowId={workflowId} />
									<PublishBtn workflowId={workflowId} />
								</>
							)}
						</>
					)}
				</div>
			</div>
		</header>
	);
}

export default Topbar;

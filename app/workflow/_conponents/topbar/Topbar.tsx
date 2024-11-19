"use client";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import { Separator } from "@/components/ui/separator";

interface Props {
	title: string;
	subtitle?: string;
	workflowId: string;
}

function Topbar({ title, subtitle, workflowId }: Props) {
	const router = useRouter();
	return (
		<header className="flex px-4 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
			<div className="flex justify-between w-full items-center">
				<div className="flex items-center justify-center gap-2">
						<Button
							variant={"secondary"}
							size={"sm"}
							onClick={() => router.back()}
						>
							<ChevronLeftIcon size={20} />
							Back
						</Button>
					<div className="flex justify-center items-center gap-4">
						<p className="font-bold text-ellipsis truncate">{title}</p>
						<Separator orientation="vertical" />
						{subtitle && (
							<p className="text-sm text-muted-foreground truncate text-ellipsis">
								{subtitle}
							</p>
						)}
					</div>
				</div>
				<SaveBtn workflowId={workflowId} />
			</div>
		</header>
	);
}

export default Topbar;

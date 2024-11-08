import { cn } from "@/lib/utils";
import { SquareDashedMousePointerIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo({
	fontSize = "text-2xl",
	iconSize = 20,
}: {
	fontSize?: string;
	iconSize?: number;
}) {
	return (
		<Link
			href="/"
			className={cn(
				"text-2xl font-extrabold flex items-center gap-2",
				fontSize
			)}
		>
			<div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/100 p-2">
				<SquareDashedMousePointerIcon
					size={iconSize}
					className="stroke-white"
				/>
			</div>
			<div>
				{" "}
				<span className="bg-gradient-to-r from-primary/90 to-primary/100 text-transparent bg-clip-text ">
					Web
				</span>
				<span className="text-stone-700 dark:text-stone-300">Scrape</span>
			</div>
		</Link>
	);
}

export default Logo;

import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
	title: string;
	value: number;
	icon: LucideIcon;
}

function StatsCard(props: Props) {
	return (
		<Card className="relative overflow-hidden h-full bg-gradient-to-br from-primary/20 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col">
			<CardHeader className="flex pb-2">
				<CardTitle className="text-lg">{props.title}</CardTitle>
				<props.icon
					size={140}
					className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary dark:opacity-25 opacity-10"
				/>
			</CardHeader>
			<CardContent>
				<div className="text-4xl font-bold text-primary">
					<ReactCountUpWrapper value={props.value} />
				</div>
			</CardContent>
		</Card>
	);
}

export default StatsCard;

import { ExecutionPhaseStatus } from "@/types/workflow";
import {
	CircleCheckIcon,
	CircleDashedIcon,
	CircleX,
	CircleXIcon,
	Loader2Icon,
} from "lucide-react";

export default function PhaseStatusBadge({
	status,
}: {
	status: ExecutionPhaseStatus;
}) {
	switch (status) {
		case ExecutionPhaseStatus.PENDING:
			return <CircleDashedIcon size={22} className="stroke-muted-foreground" />;
		case ExecutionPhaseStatus.RUNNING:
			return (
				<Loader2Icon size={22} className="animate-spin stroke-yellow-500" />
			);
		case ExecutionPhaseStatus.FAILED:
			return <CircleXIcon size={22} className="stroke-destructive" />;
		case ExecutionPhaseStatus.COMPLETED:
			return <CircleCheckIcon size={24} className=" stroke-green-500" />;
		default:
			return <div className="rounded-full">{status}</div>;
	}
}

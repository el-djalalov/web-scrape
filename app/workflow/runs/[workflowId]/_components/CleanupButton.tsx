"use client";

import { CleanupStuckExecutions } from "@/actions/workflows/cleanupStuckExecutions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CleanupButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleCleanup = async () => {
		setIsLoading(true);
		try {
			const result = await CleanupStuckExecutions();
			if (result.count > 0) {
				toast.success(`Cleaned up ${result.count} stuck execution(s)`);
				window.location.reload();
			} else {
				toast.info("No stuck executions found");
			}
		} catch (error) {
			toast.error("Failed to cleanup executions");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleCleanup}
			disabled={isLoading}
		>
			<Trash2 className="h-4 w-4 mr-2" />
			{isLoading ? "Cleaning up..." : "Cleanup Stuck Runs"}
		</Button>
	);
}

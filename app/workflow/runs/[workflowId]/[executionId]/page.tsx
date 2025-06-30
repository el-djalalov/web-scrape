import { Suspense } from "react";
import Topbar from "../../../_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import ExecutionViewer from "./_components/ExecutionViewer";

export default async function page({
	params,
}: {
	params: Promise<{
		executionId: string;
		workflowId: string;
	}>;
}) {
	const { executionId, workflowId } = await params;

	return (
		<div className="flex flex-col h-screen w-full overflow-hidden">
			<Topbar
				workflowId={workflowId}
				title="Workflow run details"
				subtitle={`Run ID: ${executionId}`}
				hideButtons
			/>

			<section className="flex h-full overflow-auto">
				<Suspense
					fallback={
						<div className="flex w-full items-center justify-center">
							<Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
						</div>
					}
				>
					<ExecutionViewerWrapper executionId={executionId} />
				</Suspense>
			</section>
		</div>
	);
}

async function ExecutionViewerWrapper({
	executionId,
}: {
	executionId: string;
}) {
	const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

	if (!workflowExecution) {
		return <div>Not found</div>;
	}

	return <ExecutionViewer initialData={workflowExecution} />;
}

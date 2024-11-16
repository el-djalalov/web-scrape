"use client";

import { Workflow } from "@prisma/client";
import {
	BackgroundVariant,
	Controls,
	ReactFlow,
	useNodesState,
	Background,
	useReactFlow,
} from "@xyflow/react";
import React, { useEffect } from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createWorkFlow";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";

const nodeTypes = {
	WebScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
	const [nodes, setNodes, onNodeChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useNodesState([]);
	const { setViewport } = useReactFlow();
	useEffect(() => {
		try {
			const flow = JSON.parse(workflow.defination);

			if (!flow) return;
			setNodes(flow.nodes || []);
			setEdges(flow.edges || []);

			//Can be used to re-create the last position
			/* if (!flow.viewport) return;
			const { x = 0, y = 0, zoom = 1 } = flow.viewport;
			setViewport({ x, y, zoom }); */
		} catch (error) {}
	}, [workflow.defination, setEdges, setNodes, setViewport]);

	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onEdgesChange={onEdgesChange}
				onNodesChange={onNodeChange}
				nodeTypes={nodeTypes}
				snapToGrid
				snapGrid={snapGrid}
				fitViewOptions={fitViewOptions}
				fitView
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;

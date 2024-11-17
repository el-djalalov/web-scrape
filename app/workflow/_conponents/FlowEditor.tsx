"use client";

import { Workflow } from "@prisma/client";
import {
	BackgroundVariant,
	Controls,
	ReactFlow,
	useNodesState,
	Background,
	useReactFlow,
	Connection,
	addEdge,
	Edge,
	useEdgesState,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createWorkFlow";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";
import { AppNode } from "@/types/appNode";
import DeletableEdge from "./edges/DeletableEdge";

const nodeTypes = {
	WebScrapeNode: NodeComponent,
};

const edgeTypes = {
	default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
	const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { setViewport, screenToFlowPosition } = useReactFlow();

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

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		const taskType = e.dataTransfer.getData("application/reactflow");
		if (typeof taskType === undefined || !taskType) return;

		const position = screenToFlowPosition({
			x: e.clientX,
			y: e.clientY,
		});
		const newNode = CreateFlowNode(taskType as TaskType, position);
		setNodes(nds => nds.concat(newNode));
	}, []);

	const onConnect = useCallback((connection: Connection) => {
		setEdges(edges => addEdge({ ...connection, animated: true }, edges));
	}, []);

	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onEdgesChange={onEdgesChange}
				onNodesChange={onNodeChange}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				snapToGrid
				snapGrid={snapGrid}
				fitViewOptions={fitViewOptions}
				fitView
				onDragOver={onDragOver}
				onDrop={onDrop}
				onConnect={onConnect}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;

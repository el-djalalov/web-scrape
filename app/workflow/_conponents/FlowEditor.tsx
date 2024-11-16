"use client";

import { Workflow } from "@prisma/client";
import {
	BackgroundVariant,
	Controls,
	ReactFlow,
	useNodesState,
	Background,
} from "@xyflow/react";
import React from "react";

import "@xyflow/react/dist/style.css";

function FlowEditor({ workflow }: { workflow: Workflow }) {
	const [nodes, setNodes, onNodeChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useNodesState([]);

	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onEdgesChange={onEdgesChange}
				onNodesChange={onNodeChange}
			>
				<Controls position="top-left" />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;

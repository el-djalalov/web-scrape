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
	getOutgoers,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createWorkFlow";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";
import { AppNode } from "@/types/appNode";
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

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
	const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

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
		} catch (error) {
			console.error("Failed to parse workflow definition:", error);
		}
	}, [workflow.defination, setEdges, setNodes, setViewport]);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const taskType = e.dataTransfer.getData("application/reactflow");
			if (typeof taskType === "undefined" || !taskType) return;

			const position = screenToFlowPosition({
				x: e.clientX,
				y: e.clientY,
			});
			const newNode = CreateFlowNode(taskType as TaskType, position);
			setNodes(nds => nds.concat(newNode));
		},
		[screenToFlowPosition, setNodes]
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges(edges => addEdge({ ...connection, animated: true }, edges));
			if (!connection.targetHandle) return;

			//Remove input val if is present on connection
			const node = nodes.find(nd => nd.id === connection.target);
			if (!node) return;
			const nodeInputs = node.data.inputs;
			updateNodeData(node.id, {
				inputs: {
					...nodeInputs,
					[connection.targetHandle]: "",
				},
			});
		},
		[setEdges, updateNodeData, nodes]
	);

	const isValidConnection = useCallback(
		(connection: Edge | Connection) => {
			// No self connection allowed
			if (connection.source === connection.target) {
				return false;
			}

			//Same taskParam type connection
			const source = nodes.find(node => node.id === connection.source);
			const target = nodes.find(node => node.id === connection.target);

			if (!source || !target) return false;

			const sourceTask = TaskRegistry[source.data.type];
			const targetTask = TaskRegistry[target.data.type];

			const output = sourceTask.outputs.find(
				o => o.name === connection.sourceHandle
			);

			const input = targetTask.inputs.find(
				i => i.name === connection.targetHandle
			);

			if (input?.type !== output?.type) {
				return false;
			}

			// Analyze graph cycle to prevent inifinite loop
			const hasCycle = (node: AppNode, visited = new Set()) => {
				if (visited.has(node.id)) return false;
				visited.add(node.id);

				for (const outgoer of getOutgoers(node, nodes, edges)) {
					if (outgoer.id === connection.source) return true;
					if (hasCycle(outgoer, visited)) return true;
				}
			};

			const detectedCycle = hasCycle(target);
			return !detectedCycle;
		},
		[nodes, edges]
	);

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
				isValidConnection={isValidConnection}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;

"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	createWorkflowSchema,
	createWorkflowSchemaType,
	duplicateWorkflowSchema,
	duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { cn } from "@/lib/utils";

function DuplicateWorkflowDialog({ workflowId }: { workflowId?: string }) {
	const [open, setOpen] = useState(false);

	const form = useForm<duplicateWorkflowSchemaType>({
		resolver: zodResolver(duplicateWorkflowSchema),
		defaultValues: {
			workflowId,
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: DuplicateWorkflow,
		onSuccess: () => {
			toast.success("Workflow successfully duplicated", {
				id: "dupliate-workflow",
			});
			setOpen(prev => !prev);
		},
		onError: () => {
			toast.error("Failed to dupliate workflow", {
				id: "dupliate-workflow",
			});
		},
	});

	const onSubmit = useCallback(
		(values: duplicateWorkflowSchemaType) => {
			toast.loading("Dupliating workflow...", { id: "dupliate-workflow" });
			mutate(values);
		},
		[mutate]
	);

	return (
		<Dialog
			open={open}
			onOpenChange={open => {
				form.reset();
				setOpen(open);
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant={"secondary"}
					size={"sm"}
					className={cn(
						"transition-opacity duration-300 opacity-0 group-hover/card:opacity-100"
					)}
				>
					<CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="px-0"
				aria-describedby="Content for creation of duplicate workflow"
			>
				<DialogHeader className="py-4">
					<DialogTitle>
						<div className="flex flex-col items-center gap-2 mb-2">
							<Layers2Icon size={30} className="stroke-primary" />

							<p className="text-primary text-xl">Duplicate workflow</p>

							<p className="text-sm text-muted-foreground">
								Start duplicating your workflow
							</p>
						</div>
					</DialogTitle>
					<Separator />
				</DialogHeader>
				{/* 		<CustomDialogHeader
					icon={Layers2Icon}
					title="Create workflow"
					subTitle="Start building your workflow"
				/> */}

				<div className="px-6">
					<Form {...form}>
						<form
							className="space-y-8 w-full"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1 items-start">
										<FormLabel className="flex gap-1">
											Name
											<p className="text-xs text-primary">(required)</p>
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>Choose a unique name</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1 items-start">
										<FormLabel className="flex gap-1">
											Description
											<p className="text-xs text-muted-foreground">
												(optional)
											</p>
										</FormLabel>
										<FormControl>
											<Textarea className="resize-none" {...field} />
										</FormControl>
										<FormDescription className="text-sm">
											Provide a brief description of what your workflow does.
											<br /> This is optional but can help you remember the
											workflow&apos;s purpose
										</FormDescription>
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isPending}>
								{!isPending && "Proceed"}
								{isPending && <Loader2 className="animate-spin" />}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default DuplicateWorkflowDialog;

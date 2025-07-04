"use client";

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
} from "@/schema/workflows";
import { Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<createWorkflowSchemaType>({
		resolver: zodResolver(createWorkflowSchema),
		defaultValues: {},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: CreateWorkflow,
		onSuccess: data => {
			toast.success("Workflow has been created successfully", {
				id: "create-workflow",
			});
			router.push(`/workflow/editor/${data?.workflowId}`);
		},
		onError: () => {
			toast.error("Failed to create workflow", {
				id: "create-workflow",
			});
		},
	});

	const onSubmit = useCallback(
		(values: createWorkflowSchemaType) => {
			toast.loading("Creating workflow...", { id: "create-workflow" });
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
				<Button> {triggerText ?? "Create workflow"}</Button>
			</DialogTrigger>
			<DialogContent className="px-0">
				<DialogHeader className="py-4">
					<DialogTitle>
						<div className="flex flex-col items-center gap-2 mb-2">
							<Layers2Icon size={30} className="stroke-primary" />

							<p className="text-primary text-xl">Create workflow</p>

							<p className="text-sm text-muted-foreground">
								Start building your workflow
							</p>
						</div>
					</DialogTitle>
					<Separator />
				</DialogHeader>

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

export default CreateWorkflowDialog;

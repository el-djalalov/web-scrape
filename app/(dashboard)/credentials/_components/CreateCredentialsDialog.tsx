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
} from "@/schema/workflows";
import { Layers2Icon, Loader2, ShieldEllipsis } from "lucide-react";
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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
	createCredentialSchema,
	createCredentialSchemaType,
} from "@/schema/credential";
import { CreateCredential } from "@/actions/credentials/CreateCredentials";

function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
	const [open, setOpen] = useState(false);

	const form = useForm<createCredentialSchemaType>({
		resolver: zodResolver(createCredentialSchema),
		defaultValues: {},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: CreateCredential,
		onSuccess: () => {
			toast.success("Credential has been created successfully", {
				id: "create-credential",
			});
			form.reset();
			setOpen(false);
		},
		onError: () => {
			toast.error("Failed to create credential", {
				id: "create-credential",
			});
		},
	});

	const onSubmit = useCallback(
		(values: createCredentialSchemaType) => {
			toast.loading("Creating credential...", {
				id: "create-credential",
			});
			mutate(values);
		},
		[mutate]
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button> {triggerText ?? "Create"}</Button>
			</DialogTrigger>
			<DialogContent className="px-0">
				<DialogHeader className="py-4">
					<DialogTitle>
						<div className="flex flex-col items-center gap-2 mb-2">
							<ShieldEllipsis size={30} className="stroke-primary" />

							<p className="text-primary text-xl">Create credential</p>
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
											<p className="text-xs text-primary"> (required)</p>
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription className="text-xs">
											Enter a unique and descriptive name for the credential{" "}
											<br />
											This name will be used to identify the credential
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1 items-start">
										<FormLabel className="flex gap-1">
											Value
											<p className="text-xs text-primary">(required)</p>
										</FormLabel>
										<FormControl>
											<Textarea className="resize-none" {...field} />
										</FormControl>
										<FormDescription className="text-xs">
											Enter the value associated with this credential
											<br />
											This will be securely encrypted and sstored
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

export default CreateCredentialDialog;

"use client";

import React from "react";

import { DeleteCredential } from "@/actions/credentials/DeleteCredential";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	name: string;
};

function DeleteCredentalDialog(props: Props) {
	const [open, setOpen] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const deleteMutation = useMutation({
		mutationFn: DeleteCredential,
		onSuccess: () => {
			toast.success("Credental deletd successfully", {
				id: "delete-credential",
			});
			setConfirmText("");
		},
		onError: () => {
			toast.error("Something went wrong", { id: "delete-credential" });
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant={"destructive"} size={"sm"}>
					<XIcon size={16} />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center">
						Are you absolutely sure ?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center">
						If you delete this credential, you will not be able to recover it
						<div className="flex flex-col py-2 gap-2">
							<p>
								If you are sure, enter <b>{props.name}</b> to confirm
							</p>
							<Input
								className="mt-2"
								value={confirmText}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setConfirmText(e.target.value)
								}
							/>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setConfirmText("")}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={confirmText !== props.name || deleteMutation.isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						onClick={() => {
							toast.loading("Deleting workflow...", {
								id: "delete-credential",
							});
							deleteMutation.mutate(props.name);
						}}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteCredentalDialog;

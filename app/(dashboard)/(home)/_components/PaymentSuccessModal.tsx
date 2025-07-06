// components/PaymentSuccessModal.tsx

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { CircleCheckBig } from "lucide-react";
import { Description } from "@radix-ui/react-dialog";

interface PaymentSuccessModalProps {
	open: boolean;
	onClose: () => void;
	amount?: number;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
	open,
	onClose,
	amount,
}) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogTrigger asChild>
				<Button style={{ display: "none" }}></Button>
			</DialogTrigger>
			<DialogContent
				className="p-6 max-w-lg mx-auto rounded-lg shadow-lg"
				aria-describedby="Payment success modal"
			>
				<Description></Description>
				<DialogTitle className="text-2xl font-semibold flex items-center gap-4">
					Payment Success{" "}
					<CircleCheckBig size={28} className="text-green-500" />
				</DialogTitle>
				<p className="mt-4 text-muted-foreground">
					Thank you for your payment! Your transaction has been processed
					successfully.
				</p>

				{amount && (
					<p className="mt-2 text-sm text-muted-foreground">
						Amount: <strong className="text-lg">${amount}</strong>
					</p>
				)}
				<div className="mt-4 flex justify-end">
					<Button onClick={onClose} className="px-6">
						<b>Close</b>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentSuccessModal;

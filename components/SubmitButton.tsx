"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends ButtonProps {
	pendingText?: string;
	children: React.ReactNode;
}

/**
 * React 19 Form Submit Button with automatic pending state
 *
 * This component uses the `useFormStatus` hook to automatically
 * disable and show loading state when a form is submitting.
 *
 * IMPORTANT: This component must be rendered as a CHILD of a <form> element,
 * not in the same component that renders the form.
 *
 * @example
 * ```tsx
 * <form action={submitAction}>
 *   <input name="email" />
 *   <SubmitButton>Sign Up</SubmitButton>
 * </form>
 * ```
 */
export function SubmitButton({
	pendingText,
	children,
	disabled,
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending || disabled} {...props}>
			{pending ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					{pendingText || "Submitting..."}
				</>
			) : (
				children
			)}
		</Button>
	);
}

/**
 * Secondary variant of SubmitButton
 */
export function SubmitButtonSecondary(props: SubmitButtonProps) {
	return <SubmitButton variant="secondary" {...props} />;
}

/**
 * Destructive variant of SubmitButton
 */
export function SubmitButtonDestructive(props: SubmitButtonProps) {
	return <SubmitButton variant="destructive" {...props} />;
}

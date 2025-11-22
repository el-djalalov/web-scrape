import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";

export default function SignInPage() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					Choose a provider to sign in to your account
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<form
					action={async () => {
						"use server";
						await signIn("google", { redirectTo: "/" });
					}}
				>
					<Button type="submit" className="w-full" variant="outline">
						<Chrome className="mr-2 h-4 w-4" />
						Continue with Google
					</Button>
				</form>
				<form
					action={async () => {
						"use server";
						await signIn("github", { redirectTo: "/" });
					}}
				>
					<Button type="submit" className="w-full" variant="outline">
						<Github className="mr-2 h-4 w-4" />
						Continue with GitHub
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

"use client";

import React, { use } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";
import GitHubSignIn from "./GitHubSignIn";
import Link from "next/link";
import { CredentialsSignIn } from "@/actions/auth/auth";
import { signIn } from "next-auth/react";

export default function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="items-center justify-center bg-gradient-to-br from-background to-muted/50 p-2 rounded-lg bg-primary bg-opacity-10">
			<Card className="max-w-full shadow-lg w-[446px] h-[664px]">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold tracking-tight">
						Welcome back
					</CardTitle>
					<CardDescription className="text-muted-foreground">
						Sign in to your account to continue
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Social Sign In Buttons */}
					<div className="space-y-3">
						<GoogleSignIn />
						<GitHubSignIn />
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with email
							</span>
						</div>
					</div>

					{/* Email Form */}
					<form className="space-y-4" action={CredentialsSignIn}>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									name="email"
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									name="password"
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									className="pl-10 pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full h-10 font-medium"
							disabled={isLoading}
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-muted-foreground">
						<span>Don&apos;t have an account? </span>
						<a
							href="/api/auth/sign-up"
							className="text-primary hover:underline font-medium"
						>
							Sign up
						</a>
					</div>

					<div className="text-xs text-center text-muted-foreground">
						<Link href="/forgot-password" className="hover:underline">
							Forgot your password?
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

"use client";

import React from "react";
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

const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-2 rounded-lg bg-primary bg-opacity-10">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold tracking-tight">
						Create an account
					</CardTitle>
					<CardDescription className="text-muted-foreground">
						Sign up to get started with your account
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Social Sign Up Buttons */}
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
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Create a password"
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

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									className="pl-10 pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? (
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
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-muted-foreground">
						<span>Already have an account? </span>
						<a
							href="/api/auth/sign-in"
							className="text-primary hover:underline font-medium"
						>
							Sign in
						</a>
					</div>

					<div className="text-xs text-center text-muted-foreground">
						By creating an account, you agree to our{" "}
						<a href="/terms" className="hover:underline">
							Terms of Service
						</a>{" "}
						and{" "}
						<Link href="/privacy" className="hover:underline">
							Privacy Policy
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default SignUp;

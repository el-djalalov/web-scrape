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
	return (
		<div className="items-center justify-center bg-gradient-to-br from-background to-muted/50 p-2 rounded-lg bg-primary bg-opacity-10">
			<Card className="max-w-full shadow-lg w-[446px]">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold tracking-tight">
						Welcome
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
				</CardContent>

				{/* 				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-muted-foreground">
						<span>Don&apos;t have an account? </span>
						<Link
							href="/api/auth/signup"
							className="text-primary hover:underline font-medium"
						>
							Sign up
						</Link>
					</div>

					<div className="text-xs text-center text-muted-foreground">
						<Link href="/forgot-password" className="hover:underline">
							Forgot your password?
						</Link>
					</div>
				</CardFooter> */}
			</Card>
		</div>
	);
}

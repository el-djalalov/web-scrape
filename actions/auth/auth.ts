"use server";
import { signIn, signOut } from "@/auth";

export const GoogleSignIn = async () => {
	return await signIn("google", {
		redirectTo: "/",
	});
};

export const GithubSignIn = async () => {
	return await signIn("github", {
		redirectTo: "/",
	});
};

export const CredentialsSignIn = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	console.log("email: ", email);
	console.log("pass: ", password);

	if (!email || !password) {
		throw new Error("Email and password are required");
	}

	return await signIn("credentials", {
		email,
		password,
		callbackUrl: "/",
	});
};

export const logOut = async () => {
	return await signOut({
		redirectTo: "/",
	});
};

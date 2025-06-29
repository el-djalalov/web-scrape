"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser({
	email,
	name,
	image,
	password,
}: {
	email: string;
	name?: string;
	image?: string;
	password: string;
}) {
	// Check if the user already exists
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		throw new Error("User already exists with this email.");
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create a new user
	const newUser = await prisma.user.create({
		data: {
			email,
			name,
			image,
			password: hashedPassword,
		},
	});

	return newUser;
}

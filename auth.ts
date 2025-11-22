import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	secret: process.env.AUTH_SECRET,
	trustHost: true,
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		}),
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID!,
			clientSecret: process.env.AUTH_GITHUB_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				token.email = user.email;
				token.name = user.name;
				token.picture = user.image;
			}
			return token;
		},
		session({ session, token }) {
			if (token) {
				session.user.id = token.sub as string;
				session.user.email = token.email as string;
				session.user.name = token.email as string;
				session.user.image = token.image as string;
			}
			return session;
		},
	},
	events: {
		// ← fires once *after* a new user is created in the database. This is useful for giving welcome bonus credits
		async createUser({ user }) {
			if (!user.id) {
				throw new Error("User ID is undefined when creating user balance.");
			}
			await prisma.userBalance.create({
				data: {
					userId: user.id,
					credits: 500,
				},
			});
		},
	},
});

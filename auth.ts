import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";

import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google,
		GitHub,
		Credentials({
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Enter your email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Enter your password",
				},
			},
			authorize: async credentials => {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: String(credentials.email) },
				});

				if (!user || user.password !== credentials.password) {
					return null;
				}

				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const dbUser = await prisma.user.findUnique({
					where: { email: user.email as string },
				});
				if (dbUser) {
					token.id = dbUser.id;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === "google" || account?.provider === "github") {
				let dbUser = await prisma.user.findUnique({
					where: { email: user.email as string },
				});

				if (!dbUser) {
					dbUser = await prisma.user.create({
						data: {
							email: user.email as string,
							name: user.name,
							image: user.image,
							password: "",
						},
					});
				}

				const existingAccount = await prisma.account.findUnique({
					where: {
						provider_providerAccountId: {
							provider: account.provider,
							providerAccountId: account.providerAccountId,
						},
					},
				});

				if (!existingAccount) {
					await prisma.account.create({
						data: {
							userId: dbUser.id,
							type: account.type,
							provider: account.provider,
							providerAccountId: account.providerAccountId,
							access_token: account.access_token,
							expires_at: account.expires_at,
							scope: account.scope,
							token_type: account.token_type,
							id_token: account.id_token,
						},
					});
				}
			}
			return true;
		},
	},
});

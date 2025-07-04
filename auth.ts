import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		/* 	Credentials({
			authorize: async credentials => {
				try {
					const { email, password } = await signInSchema.parseAsync(
						credentials
					);

					const user = await db.user.findUnique({ where: { email } });

					if (!user || !user.password) {
						return null;
					}

					const valid = await bcrypt.compare(password, user.password);

					if (!valid) {
						return null;
					}

					const { password: _, ...safeUser } = user;
					return safeUser;
				} catch (error) {
					return null;
				}
			},
		}), */
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

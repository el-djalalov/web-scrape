import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";

// Middleware-compatible auth without Prisma adapter (Edge runtime compatible)
// Uses JWT sessions only - no database calls in middleware
export const { auth } = NextAuth({
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
});

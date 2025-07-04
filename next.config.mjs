/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
		AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
		AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
	},

	images: {
		domains: [
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
			"cdn.discordapp.com",
			"cdn.pixabay.com",
			"images.unsplash.com",
		],
	},
};

export default nextConfig;

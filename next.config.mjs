/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
	},
	webpack(config, { isServer }) {
		if (isServer) {
			// don’t bundle them, just require() at runtime
			config.externals.push("@sparticuz/chromium", "puppeteer-core");
		}
		return config;
	},
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

	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = [...config.externals, "@sparticuz/chromium-min"];
		}
		return config;
	},
};

export default nextConfig;

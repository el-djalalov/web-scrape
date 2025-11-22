/** @type {import('next').NextConfig} */
const nextConfig = {
	// Webpack configuration for server-side externals
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Don't bundle these packages, just require() at runtime
			config.externals.push(
				"@sparticuz/chromium",
				"@sparticuz/chromium-min",
				"puppeteer-core"
			);
		}
		return config;
	},

	// Environment variables
	env: {
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
		AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
		AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
	},

	// Modern image optimization with remotePatterns (replaces deprecated domains)
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
			},
			{
				protocol: "https",
				hostname: "cdn.pixabay.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},

	// Experimental optimizations for Next.js 15
	experimental: {
		// Optimize package imports to reduce bundle size
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-alert-dialog",
			"@radix-ui/react-aspect-ratio",
			"@radix-ui/react-avatar",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-collapsible",
			"@radix-ui/react-context-menu",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-hover-card",
			"@radix-ui/react-label",
			"@radix-ui/react-menubar",
			"@radix-ui/react-navigation-menu",
			"@radix-ui/react-popover",
			"@radix-ui/react-progress",
			"@radix-ui/react-radio-group",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-select",
			"@radix-ui/react-separator",
			"@radix-ui/react-slider",
			"@radix-ui/react-slot",
			"@radix-ui/react-switch",
			"@radix-ui/react-tabs",
			"@radix-ui/react-toast",
			"@radix-ui/react-toggle",
			"@radix-ui/react-toggle-group",
			"@radix-ui/react-tooltip",
		],
	},
};

export default nextConfig;

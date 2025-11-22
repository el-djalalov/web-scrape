/**
 * Resource Preloading Utilities for React 19
 *
 * These functions use React 19's resource preloading APIs to optimize
 * loading of external scripts, fonts, and establish early connections.
 */

import { preinit, preconnect, preload, prefetchDNS } from "react-dom";

/**
 * Preload Stripe payment SDK
 * Call this in billing/payment pages to load Stripe faster
 */
export function preloadStripe() {
	preconnect("https://js.stripe.com");
	preconnect("https://m.stripe.com");
	preinit("https://js.stripe.com/v3/", { as: "script" });
}

/**
 * Preload Google Analytics (if used)
 */
export function preloadGoogleAnalytics() {
	prefetchDNS("https://www.googletagmanager.com");
	preconnect("https://www.google-analytics.com");
}

/**
 * Preload external fonts
 * Add your custom fonts here
 */
export function preloadFonts() {
	// Example: Preload Inter font if you're using a CDN version
	// preload('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', {
	//   as: 'style',
	// })
}

/**
 * Preload API connections
 * Establishes early connection to your API servers
 */
export function preloadAPIConnections() {
	// Preconnect to your API if it's on a different domain
	// preconnect('https://api.yourapp.com')
}

/**
 * Preload all critical resources for the application
 * Call this in the root layout for global optimizations
 */
export function preloadCriticalResources() {
	preloadFonts();
	preloadAPIConnections();
}

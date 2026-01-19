/**
 * URL validation utilities to prevent SSRF attacks and ensure safe URL handling.
 */

// Private/internal IP ranges that should be blocked
const PRIVATE_IP_RANGES = [
	/^127\./,                    // localhost
	/^10\./,                     // 10.0.0.0/8
	/^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
	/^192\.168\./,               // 192.168.0.0/16
	/^169\.254\./,               // link-local
	/^0\./,                      // 0.0.0.0/8
	/^fc00:/i,                   // IPv6 unique local
	/^fe80:/i,                   // IPv6 link-local
	/^::1$/,                     // IPv6 localhost
	/^localhost$/i,
];

// Blocked hostnames
const BLOCKED_HOSTNAMES = [
	"localhost",
	"127.0.0.1",
	"0.0.0.0",
	"::1",
	"metadata.google.internal",       // GCP metadata
	"169.254.169.254",                // AWS/Azure/GCP metadata endpoint
	"metadata.google.internal.",
];

// Allowed schemes
const ALLOWED_SCHEMES = ["http:", "https:"];

export type UrlValidationResult = {
	valid: boolean;
	error?: string;
	url?: URL;
};

/**
 * Validates a URL for safe external requests, blocking SSRF attack vectors.
 */
export function validateUrl(urlString: string): UrlValidationResult {
	if (!urlString || typeof urlString !== "string") {
		return { valid: false, error: "URL is required" };
	}

	let url: URL;
	try {
		url = new URL(urlString);
	} catch {
		return { valid: false, error: "Invalid URL format" };
	}

	// Check scheme
	if (!ALLOWED_SCHEMES.includes(url.protocol)) {
		return {
			valid: false,
			error: `Invalid URL scheme: ${url.protocol}. Only HTTP and HTTPS are allowed`,
		};
	}

	const hostname = url.hostname.toLowerCase();

	// Check for blocked hostnames
	if (BLOCKED_HOSTNAMES.includes(hostname)) {
		return {
			valid: false,
			error: "URL points to a blocked internal address",
		};
	}

	// Check for private IP ranges
	for (const pattern of PRIVATE_IP_RANGES) {
		if (pattern.test(hostname)) {
			return {
				valid: false,
				error: "URL points to a private/internal IP address",
			};
		}
	}

	// Check for numeric localhost variations (127.0.0.1 in decimal, etc.)
	// 2130706433 = 127.0.0.1 in decimal
	if (/^\d+$/.test(hostname)) {
		const num = parseInt(hostname, 10);
		// Decimal representation of 127.x.x.x range
		if (num >= 2130706432 && num <= 2147483647) {
			return {
				valid: false,
				error: "URL points to localhost (numeric format)",
			};
		}
	}

	return { valid: true, url };
}

/**
 * Validates a URL specifically for browser navigation.
 * Allows data: URLs for limited use cases, but blocks javascript: and other dangerous schemes.
 */
export function validateBrowserUrl(urlString: string): UrlValidationResult {
	if (!urlString || typeof urlString !== "string") {
		return { valid: false, error: "URL is required" };
	}

	let url: URL;
	try {
		url = new URL(urlString);
	} catch {
		return { valid: false, error: "Invalid URL format" };
	}

	// Block dangerous schemes
	const dangerousSchemes = ["javascript:", "vbscript:", "file:"];
	if (dangerousSchemes.includes(url.protocol)) {
		return {
			valid: false,
			error: `Dangerous URL scheme: ${url.protocol}`,
		};
	}

	// For browser navigation, allow http and https
	if (ALLOWED_SCHEMES.includes(url.protocol)) {
		return { valid: true, url };
	}

	return {
		valid: false,
		error: `Unsupported URL scheme: ${url.protocol}`,
	};
}

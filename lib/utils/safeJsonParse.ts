/**
 * Safely parses a JSON string, returning a typed result or null on failure.
 * Prevents uncaught SyntaxError exceptions from malformed JSON.
 */
export function safeJsonParse<T>(json: string): T | null {
	try {
		return JSON.parse(json) as T;
	} catch {
		return null;
	}
}

/**
 * Safely parses JSON with a default value fallback.
 * Useful when you need a guaranteed return value.
 */
export function safeJsonParseWithDefault<T>(json: string, defaultValue: T): T {
	try {
		return JSON.parse(json) as T;
	} catch {
		return defaultValue;
	}
}

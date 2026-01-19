/**
 * Structured logging utility for consistent log formatting across the application.
 * Provides log levels, timestamps, and context for better debugging and monitoring.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
	[key: string]: unknown;
}

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	context?: LogContext;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

// Default minimum log level from environment, defaults to 'info' in production
const MIN_LOG_LEVEL: LogLevel =
	(process.env.LOG_LEVEL as LogLevel) ||
	(process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
	return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LOG_LEVEL];
}

function formatLogEntry(entry: LogEntry): string {
	const contextStr = entry.context
		? ` ${JSON.stringify(entry.context)}`
		: "";
	return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`;
}

function createLogEntry(
	level: LogLevel,
	message: string,
	context?: LogContext
): LogEntry {
	return {
		timestamp: new Date().toISOString(),
		level,
		message,
		context,
	};
}

function log(level: LogLevel, message: string, context?: LogContext): void {
	if (!shouldLog(level)) return;

	const entry = createLogEntry(level, message, context);
	const formattedMessage = formatLogEntry(entry);

	switch (level) {
		case "debug":
			console.debug(formattedMessage);
			break;
		case "info":
			console.info(formattedMessage);
			break;
		case "warn":
			console.warn(formattedMessage);
			break;
		case "error":
			console.error(formattedMessage);
			break;
	}
}

/**
 * Main logger object with methods for each log level.
 */
export const logger = {
	debug: (message: string, context?: LogContext) =>
		log("debug", message, context),
	info: (message: string, context?: LogContext) =>
		log("info", message, context),
	warn: (message: string, context?: LogContext) =>
		log("warn", message, context),
	error: (message: string, context?: LogContext) =>
		log("error", message, context),
};

/**
 * Creates a logger instance with a specific context prefix.
 * Useful for module-specific logging.
 */
export function createLogger(module: string) {
	return {
		debug: (message: string, context?: LogContext) =>
			log("debug", message, { module, ...context }),
		info: (message: string, context?: LogContext) =>
			log("info", message, { module, ...context }),
		warn: (message: string, context?: LogContext) =>
			log("warn", message, { module, ...context }),
		error: (message: string, context?: LogContext) =>
			log("error", message, { module, ...context }),
	};
}

export default logger;

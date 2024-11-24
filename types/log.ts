import { number } from "zod";

export const LogLevels = ["info", "error"] as const;

export type LogLevel = (typeof LogLevels)[number];

export type LogFunction = (message: string) => void;

export type Log = {
	message: string;
	logLevel: LogLevel;
	timestamp: Date;
};

export type LogCollector = {
	getAll(): Log[];
} & {
	[K in LogLevel]: LogFunction;
};

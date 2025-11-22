"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { cache } from "react";
import { unstable_cache } from "next/cache";

// Use React.cache() for request memoization
// This ensures the same data is returned for the same user within a single request
const getWorkflowsFromDb = cache(async (userId: string) => {
	// Use unstable_cache for cross-request caching with tags
	// Data is cached and revalidated when workflow data changes
	const getCachedWorkflows = unstable_cache(
		async (userId: string) => {
			return prisma.workflow.findMany({
				where: {
					userId,
				},
				orderBy: {
					createdAt: "asc",
				},
			});
		},
		["user-workflows", userId],
		{
			tags: [`user-workflows-${userId}`, "workflows"],
			revalidate: 60, // Revalidate every 60 seconds
		}
	);

	return getCachedWorkflows(userId);
});

export async function GetWorkflowForUsers() {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}
	if (!session.user) {
		throw new Error("User not found");
	}

	return getWorkflowsFromDb(session.user.id);
}

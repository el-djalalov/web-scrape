"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Cache revalidation utilities for Next.js 15
 * Use these functions to invalidate cached data when mutations occur
 */

// Revalidate workflow-related caches
export async function revalidateWorkflowCache(userId: string) {
	revalidateTag(`user-workflows-${userId}`);
	revalidateTag("workflows");
}

// Revalidate analytics caches
export async function revalidateAnalyticsCache(userId: string) {
	revalidateTag(`stats-${userId}`);
	revalidateTag(`executions-${userId}`);
	revalidateTag(`credits-${userId}`);
	revalidateTag("analytics");
}

// Revalidate all user data
export async function revalidateUserData(userId: string) {
	await revalidateWorkflowCache(userId);
	await revalidateAnalyticsCache(userId);
}

// Revalidate specific paths
export async function revalidateWorkflowsPage() {
	revalidatePath("/workflows");
}

export async function revalidateHomePage() {
	revalidatePath("/(dashboard)/(home)", "page");
}

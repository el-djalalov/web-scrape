"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
	createCredentialSchema,
	createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: createCredentialSchemaType) {
	const { success, data } = createCredentialSchema.safeParse(form);

	if (!success) {
		throw new Error("Invalid form data");
	}
	const session = await auth();

	if (!session || !session.user) {
		throw new Error("Unauthenticated");
	}

	// Encrypt value

	const encryptedValue = symmetricEncrypt(data.value);

	const result = await prisma.credential.create({
		data: {
			userId: session.user.id,
			name: data?.name,
			value: encryptedValue,
		},
	});

	if (!result) {
		throw new Error("Failed to create credential");
	}

	revalidatePath("/credentials");
}

import crypto from "crypto";
import "server-only";

const algo = "aes-256-cbc"; // key leng this 32 bytes
// openssl rand -hex 32

export const symmetricEncrypt = (data: string) => {
	const key = process.env.ENCRYPTION_KEY;
	if (!key) {
		throw new Error("Encryption key was not found");
	}

	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(algo, Buffer.from(key, "hex"), iv);

	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encrypted: string) => {
	const key = process.env.ENCRYPTION_KEY;
	if (!key) {
		throw new Error("Encryption key was not found");
	}

	const textParts = encrypted.split(":");
	const iv = Buffer.from(textParts.shift() as string, "hex");
	const encryptedText = Buffer.from(textParts.join(":"), "hex");
	const decipher = crypto.createDecipheriv(algo, Buffer.from(key, "hex"), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};

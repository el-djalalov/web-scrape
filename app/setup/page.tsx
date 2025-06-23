import { SetUpuser } from "@/actions/billing/setupUser";
import { waitFor } from "@/lib/helper/waitFor";

export default async function SetUpPage() {
	await waitFor(5000);
	return await SetUpuser();
}

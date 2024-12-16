import { SetUpuser } from "@/actions/billing/setpUser";
import { waitFor } from "@/lib/helper/waitFor";

export default async function SetUpPage() {
	return await SetUpuser();
}

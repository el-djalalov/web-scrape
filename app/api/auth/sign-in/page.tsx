import { auth } from "@/auth";
import SignIn from "@/components/SignIn";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await auth();
	console.log("Session in sign-in page:", session);
	if (session) redirect("/");
	return <SignIn />;
}

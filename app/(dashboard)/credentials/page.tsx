import React, { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GetCredentialsForUser } from "@/actions/credentials/GetCredentialsForUser";
import { Card } from "@/components/ui/card";
import CreateCredentialDialog from "./_components/CreateCredentialsDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "./_components/DeleteCredentalDialog";

export default function Credentials() {
	return (
		<div className="flex flex-1 flex-col h-full">
			<div className="flex justify-between">
				<div className=" flex flex-col">
					<h1 className="text-3xl font-bold">Credentials</h1>
					<p className="">Manage your credentials</p>
				</div>

				<CreateCredentialDialog />
			</div>

			<div className="h-full py-6 space-y-8">
				<Alert>
					<ShieldIcon className="h-8 w-8 stroke-primary" />
					<AlertTitle className="text-primary ml-4">Encryption</AlertTitle>
					<AlertDescription className="ml-4 text-sm text-muted-foreground">
						All information is securely encrypted, ensuring your data remains
						safe
					</AlertDescription>
				</Alert>

				<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
					<UserCredentials />
				</Suspense>
			</div>
		</div>
	);
}

async function UserCredentials() {
	const creds = await GetCredentialsForUser();

	if (!creds) {
		return <div>Something is wrong</div>;
	}

	if (creds.length === 0) {
		return (
			<Card className="w-full p-4">
				<div className="flex flex-col gap-4 items-center justify-center">
					<div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
						<ShieldOffIcon size={40} className="stroke-primary" />
					</div>
					<div className="flex flex-col gap-1 text-center">
						<p className="font-bold">No credentials yet</p>
						<p className="text-sm text-muted-foreground">
							Click the button below to create your first credential
						</p>
					</div>
					<CreateCredentialDialog triggerText="Create your first credential" />
				</div>
			</Card>
		);
	}

	return (
		<div>
			{creds.map(credential => {
				const createsAt = formatDistanceToNow(credential.createdAt, {
					addSuffix: true,
				});
				return (
					<Card key={credential.id} className="w-full p-4 flex justify-between">
						<div className="flex gap-4 items-center">
							<div className="rounded-full bg-secondary w-10 h-10 flex items-center justify-center">
								<LockKeyholeIcon size={20} className="stroke-primary" />
							</div>
							<div>
								<p className="font-bold">{credential.name}</p>
								<p className="text-sm text-muted-foreground">{createsAt}</p>
							</div>
						</div>

						<DeleteCredentialDialog name={credential.name} />
					</Card>
				);
			})}
		</div>
	);
}

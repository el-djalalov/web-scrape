"use client";

import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { GetCredentialsForUser } from "@/actions/credentials/GetCredentialsForUser";

export default function CredentialsParam({
	param,
	updateNodeParamValue,
	value,
}: ParamProps) {
	const id = useId();
	const query = useQuery({
		queryFn: () => GetCredentialsForUser(),
		queryKey: ["credentials-for-user"],
		refetchInterval: 10000,
	});
	return (
		<div className="flex flex-col gap-1 w-full">
			<Label>
				{param.name}
				{param.required && <p className="text-red-400 px-2">*</p>}
			</Label>
			<Select
				onValueChange={value => updateNodeParamValue(value)}
				defaultValue={value}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a credential" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Credentials</SelectLabel>
						{query.data?.map(cred => (
							<SelectItem key={cred.id} value={cred.id}>
								{cred.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

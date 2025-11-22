"use client";

import { useSession, signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export function UserButton() {
	const { data: session } = useSession();

	if (!session?.user) return null;

	const initials = session.user.name
		? session.user.name
				.split(" ")
				.map(n => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: session.user.email?.[0].toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex items-center gap-2 outline-none">
					<Avatar className="h-8 w-8 cursor-pointer">
						<AvatarImage src={session.user.image || undefined} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{session.user.name}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{session.user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<button
						onClick={() => signOut({ callbackUrl: "/signin" })}
						className="w-full cursor-pointer"
					>
						<LogOut className="mr-2 h-4 w-4" />
						Sign out
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

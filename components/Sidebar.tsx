"use client";

import {
	CoinsIcon,
	HomeIcon,
	Layers2Icon,
	MenuIcon,
	ShieldCheckIcon,
} from "lucide-react";
import React, { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserAvailableCreditBadge from "./UserAvailableCreditBadge";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const routes = [
	{
		href: "/",
		label: "Home",
		icon: HomeIcon,
	},
	{
		href: "workflows",
		label: "WorkFlows",
		icon: Layers2Icon,
	},
	{
		href: "credentials",
		label: "Credentials",
		icon: ShieldCheckIcon,
	},
	{
		href: "billing",
		label: "Billing",
		icon: CoinsIcon,
	},
];
function DesktopSidebar() {
	const pathname = usePathname();
	const { data: session } = useSession();

	//console.log(session);

	const activeRoute =
		routes.find(route => route.href !== "/" && pathname.includes(route.href)) ||
		routes[0];

	console.log(activeRoute);

	return (
		<div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2  border-separate">
			<div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
				<Logo />
			</div>
			<div className="p-2">
				<UserAvailableCreditBadge />
			</div>
			<div className="flex flex-col px-3 py-4 gap-3">
				{routes.map(route => (
					<Link
						key={route.href}
						href={route.href}
						className={`flex items-center w-full text-left px-4 py-2 gap-4 rounded-md transition-colors ${
							activeRoute.href === route.href
								? "bg-primary/10 text-white font-medium border-l-2 border-primary"
								: "text-muted-foreground hover:bg-primary/5 hover:text-white"
						}`}
					>
						<route.icon size={20} />
						{route.label}
					</Link>
				))}
			</div>
			{session && (
				<div className="absolute bottom-4 left-4 right-4">
					<div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
						<Avatar>
							<AvatarImage src={session.user?.image || ""} />
							<AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="text-sm font-semibold">
								{session.user?.name}
							</span>
							<span className="text-xs text-muted-foreground">
								{session.user?.email}
							</span>
						</div>
					</div>
					<Button
						variant="outline"
						className="w-full mt-2"
						onClick={() => signOut()}
					>
						Sign out
					</Button>
				</div>
			)}
		</div>
	);
}

export function MobileSideBar() {
	const [isOpen, setOpen] = useState(false);
	const pathname = usePathname();
	const { data: session } = useSession();
	const activeRoute =
		routes.find(
			route => route.href.length > 0 && pathname.includes(route.href)
		) || routes[0];

	return (
		<div className="block border-separate bg-background md:hidden">
			<nav className="container items-center justify-between px-8">
				<Sheet open={isOpen} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant={"ghost"}>
							<MenuIcon />
						</Button>
					</SheetTrigger>
					<SheetContent
						className="w-[400px] sm:w-[540px] space-y-4"
						side={"left"}
					>
						<Logo />
						<UserAvailableCreditBadge />
						<div className="flex flex-col gap-4">
							{routes.map(route => (
								<Link
									key={route.href}
									href={route.href}
									className={`flex items-center w-full text-left px-4 py-2 gap-4 rounded-md transition-colors ${
										activeRoute.href === route.href
											? "bg-primary/10 text-white font-medium border-l-2 border-primary"
											: "text-muted-foreground hover:bg-primary/5 hover:text-white"
									}`}
								>
									<route.icon size={20} />
									{route.label}
								</Link>
							))}
						</div>
						{session && (
							<div className="absolute bottom-4 left-4 right-4">
								<div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
									<Avatar>
										<AvatarImage src={session.user?.image || ""} />
										<AvatarFallback>
											{session.user?.name?.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm font-semibold">
											{session.user?.name}
										</span>
										<span className="text-xs text-muted-foreground">
											{session.user?.email}
										</span>
									</div>
								</div>
								<Button
									variant="outline"
									className="w-full mt-2"
									onClick={() => signOut()}
								>
									Sign out
								</Button>
							</div>
						)}
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
}
export default DesktopSidebar;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
	const { data: session } = useSession();

	const authenticatedLinks = [
		{ href: "/jobs", label: "Browse Jobs" },
		{ href: "/post-job", label: "Post a Job" },
		{ href: "/dashboard", label: "Dashboard" },
	];

	const unauthenticatedLinks = [{ href: "/auth/signin", label: "Sign In" }];

	const links = session?.user ? authenticatedLinks : unauthenticatedLinks;

	return (
		<nav className="w-full border-b border-[#23466d] bg-[#0d2442]">
			<div className="mx-auto flex max-w-7xl flex-col gap-4 px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
				<Link
					href="/"
					className="inline-flex items-center gap-3 text-lg font-semibold text-slate-100 transition-colors hover:text-sky-300"
				>
					<Image
						src="/logo.png"
						alt="Job Board Logo"
						width={40}
						height={40}
						priority
					/>
					<span>Job Board</span>
				</Link>

				<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="transition-colors hover:text-sky-300"
						>
							{link.label}
						</Link>
					))}

					{session?.user && (
						<>
							<span className="border-l border-slate-700 pl-4 text-xs text-slate-400 font-normal">
								{session.user.name || session.user.email}
							</span>
							<button
								onClick={() => signOut({ callbackUrl: "/" })}
								className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
							>
								Sign Out
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { auth } from "@/auth";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Job Posting App",
	description: "Find your dream job with our easy-to-use platform",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SessionProvider session={session}>
					<div className="min-h-screen bg-[#081a33]">
						<Navbar />
						<main className="px-8">{children}</main>
					</div>
				</SessionProvider>
			</body>
		</html>
	);
}

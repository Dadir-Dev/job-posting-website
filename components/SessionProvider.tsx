"use client";

import { SessionProvider as Provider } from "next-auth/react";

type Props = {
	children: React.ReactNode;
	session: any;
};

export default function SessionProviderWrapper({ children, session }: Props) {
	return <Provider session={session}>{children}</Provider>;
}

import type { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export default {
  providers: [GitHubProvider, GoogleProvider],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request }) {
      return Boolean(auth) || request.nextUrl.pathname === "/auth/signin";
    },
  },
} satisfies NextAuthConfig;
"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const errors = { email: "", password: "" };

    if (!email.trim()) {
      errors.email = "Enter your email address.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Enter your password.";
    }

    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setFormError(
      "Sign-in is not connected yet. Add your authentication provider to continue.",
    );
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setFormError("");
    setIsSubmitting(true);

    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      setIsSubmitting(false);
      setFormError("Unable to start sign-in. Please try again.");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-89px)] items-center justify-center py-12 sm:py-16">
      <section
        className="w-full max-w-md rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-2xl shadow-black/20 sm:p-8"
        aria-labelledby="signin-title"
      >
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
            JobBoard
          </p>
          <h1 id="signin-title" className="text-3xl font-bold text-slate-50">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sign in to post jobs, manage applications, and find your next
            opportunity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#3a5b80] bg-[#102f54] px-4 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-sky-400 hover:bg-[#153b68] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#0d2442] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6-.01c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
          </svg>
          Continue with GitHub
        </button>

        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isSubmitting}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-[#3a5b80] bg-[#102f54] px-4 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-sky-400 hover:bg-[#153b68] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#0d2442] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285f4]"
          >
            G
          </span>
          Continue with Google
        </button>

        <div
          className="my-7 flex items-center gap-4 text-xs text-slate-400"
          role="presentation"
        >
          <span className="h-px flex-1 bg-[#315274]" />
          <span>OR CONTINUE WITH EMAIL</span>
          <span className="h-px flex-1 bg-[#315274]" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className="w-full rounded-lg border border-[#3a5b80] bg-[#081a33] px-4 py-3 text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-rose-300"
                role="alert"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-sky-300 transition-colors hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                className="w-full rounded-lg border border-[#3a5b80] bg-[#081a33] px-4 py-3 pr-20 text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-slate-300 transition-colors hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                className="mt-2 text-sm text-rose-300"
                role="alert"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-[#3a5b80] bg-[#081a33] text-sky-500 focus:ring-2 focus:ring-sky-400 focus:ring-offset-0"
            />
            Remember me on this device
          </label>

          {formError && (
            <p
              className="rounded-lg border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm leading-5 text-rose-200"
              role="alert"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-sky-400 px-4 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-[#0d2442] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm leading-6 text-slate-400">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-sky-300 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-sky-300 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <p className="mt-6 border-t border-[#23466d] pt-6 text-center text-sm text-slate-300">
          New to JobBoard?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-sky-300 transition-colors hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default SignInPage;

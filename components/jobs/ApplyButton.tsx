"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { applyToJobAction } from "@/lib/actions/applications";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isAuthenticated: boolean;
  isOwner?: boolean;
  initialHasApplied?: boolean;
  initialStatus?: string | null;
  className?: string;
  fullWidth?: boolean;
}

export function ApplyButton({
  jobId,
  isAuthenticated,
  isOwner = false,
  initialHasApplied = false,
  initialStatus = "pending",
  className = "",
  fullWidth = false,
}: ApplyButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [status, setStatus] = useState(initialStatus || "pending");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=/jobs/${jobId}`);
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await applyToJobAction(jobId);
        if (res.success) {
          setHasApplied(true);
          setStatus("pending");
          router.refresh();
        } else {
          setErrorMsg(res.error || "Failed to submit application.");
        }
      } catch {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    });
  };

  // Case 1: The signed in user is the owner who posted this job
  if (isOwner) {
    return (
      <div
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-5 py-2.5 text-xs font-semibold text-sky-300 ${
          fullWidth ? "w-full" : ""
        } ${className}`}
      >
        <SparklesIcon className="h-4 w-4 text-sky-400" />
        <span>You posted this job</span>
      </div>
    );
  }

  // Case 2: The user has already submitted an application
  if (hasApplied) {
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        <div
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-5 py-3 text-xs font-bold text-emerald-200 shadow-md ${
            fullWidth ? "w-full" : ""
          } ${className}`}
        >
          <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
          <span>Application Submitted ({formattedStatus})</span>
        </div>
      </div>
    );
  }

  // Case 3: User is not authenticated
  if (!isAuthenticated) {
    return (
      <Link
        href={`/auth/signin?callbackUrl=/jobs/${jobId}`}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-[#081a33] transition-all hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-lg shadow-sky-400/20 ${
          fullWidth ? "w-full text-xs py-2.5" : ""
        } ${className}`}
      >
        <LockClosedIcon className="h-4 w-4 stroke-[2.5]" />
        <span>Sign in to Apply</span>
      </Link>
    );
  }

  // Case 4: Authenticated and eligible to apply
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={handleApply}
        disabled={isPending}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-[#081a33] transition-all hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-lg shadow-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${
          fullWidth ? "w-full text-xs py-2.5" : ""
        } ${className}`}
      >
        {isPending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#081a33] border-t-transparent" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Apply for this role</span>
          </>
        )}
      </button>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

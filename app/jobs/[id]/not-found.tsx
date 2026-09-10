import Link from "next/link";
import { ArrowLeftIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

export default function JobNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#23466d] bg-[#0d2442] p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-400">
          <BriefcaseIcon className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Job Not Found</h1>
        <p className="mt-3 text-sm text-slate-300">
          The job listing you are looking for does not exist or has been removed.
        </p>
        <div className="mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to all jobs
          </Link>
        </div>
      </div>
    </main>
  );
}

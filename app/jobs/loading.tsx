import { JobListSkeleton } from "@/components/jobs/JobSkeletons";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function JobsLoading() {
  return (
    <main className="mx-auto max-w-7xl py-10">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
          <SparklesIcon className="h-3.5 w-3.5" />
          Explore Careers
        </div>
        <div className="mt-3 h-9 w-72 rounded-lg bg-[#0d2442] animate-pulse" />
        <div className="mt-2 h-4 w-96 rounded bg-[#0d2442] animate-pulse" />
      </div>

      {/* Search Skeleton */}
      <div className="mb-8 h-12 w-full max-w-2xl rounded-xl bg-[#0d2442] border border-[#23466d] animate-pulse" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="h-80 rounded-2xl bg-[#0d2442] border border-[#23466d] animate-pulse lg:col-span-1" />
        <div className="lg:col-span-3">
          <JobListSkeleton />
        </div>
      </div>
    </main>
  );
}

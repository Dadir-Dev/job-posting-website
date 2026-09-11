import { SparklesIcon } from "@heroicons/react/24/outline";

export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-7xl py-10">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
          <SparklesIcon className="h-3.5 w-3.5" />
          User Dashboard
        </div>
        <div className="mt-3 h-9 w-64 rounded-lg bg-[#0d2442] animate-pulse" />
        <div className="mt-2 h-4 w-96 rounded bg-[#0d2442] animate-pulse" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 animate-pulse"
          />
        ))}
      </div>

      {/* 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-[#0d2442] animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 animate-pulse"
            />
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-[#0d2442] animate-pulse" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

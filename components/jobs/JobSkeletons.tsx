export function JobCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-xl animate-pulse">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-[#1c3f68]" />
          <div className="h-5 w-16 rounded-full bg-[#1c3f68]" />
        </div>
        <div className="mt-4 h-6 w-3/4 rounded bg-[#1c3f68]" />
        <div className="mt-3 flex gap-3">
          <div className="h-3.5 w-20 rounded bg-[#1c3f68]" />
          <div className="h-3.5 w-24 rounded bg-[#1c3f68]" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-[#1c3f68]" />
          <div className="h-3 w-4/5 rounded bg-[#1c3f68]" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[#23466d]/70 pt-4">
        <div className="h-3 w-20 rounded bg-[#1c3f68]" />
        <div className="h-3 w-20 rounded bg-[#1c3f68]" />
      </div>
    </div>
  );
}

export function JobListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

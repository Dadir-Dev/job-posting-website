import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export interface ApplicationCardProps {
  application: {
    id: string;
    status: string;
    appliedAt: Date | string;
    job: {
      id: string;
      title: string;
      company: string;
      location: string;
      type: string;
    };
  };
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { job, status, appliedAt } = application;

  const timeAgo = formatDistanceToNow(new Date(appliedAt), {
    addSuffix: true,
  });

  const getStatusBadge = (st: string) => {
    const norm = st.toLowerCase();
    if (norm === "accepted") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }
    if (norm === "rejected") {
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    }
    if (norm === "reviewing") {
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    }
    // default: pending
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  };

  return (
    <article className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 shadow-lg transition-all duration-300 hover:border-sky-400/40">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-100 hover:text-sky-300 transition-colors">
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            <BuildingOfficeIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{job.company}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span>•</span>
            <span className="rounded bg-[#102f54] px-2 py-0.5 text-[11px] font-medium text-slate-300">
              {job.type}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              Applied {timeAgo}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="self-start">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusBadge(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 flex items-center justify-end border-t border-[#23466d]/60 pt-3.5 text-xs">
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-sky-300 transition-colors"
        >
          <span>View Job</span>
          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

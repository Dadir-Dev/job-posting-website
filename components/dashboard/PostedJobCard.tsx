"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export interface Applicant {
  id: string;
  status: string;
  appliedAt: Date | string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface PostedJobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    postedAt: Date | string;
    applicationsCount: number;
    applications?: Applicant[];
  };
}

export function PostedJobCard({ job }: PostedJobCardProps) {
  const [showApplicants, setShowApplicants] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(job.postedAt), {
    addSuffix: true,
  });

  const count = job.applicationsCount;
  const applicationsLabel = `${count} ${count === 1 ? "application" : "applications"}`;

  return (
    <article className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 shadow-lg transition-all duration-300 hover:border-sky-400/40">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 hover:text-sky-300 transition-colors">
              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
          </div>

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
              {timeAgo}
            </span>
          </div>
        </div>

        {/* Applications Count Badge */}
        <div className="flex items-center gap-2 self-start">
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
            <UsersIcon className="h-3.5 w-3.5" />
            {applicationsLabel}
          </span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-[#23466d]/60 pt-3.5 text-xs">
        {count > 0 ? (
          <button
            type="button"
            onClick={() => setShowApplicants((prev) => !prev)}
            className="inline-flex items-center gap-1.5 font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>{showApplicants ? "Hide Candidates" : "View Candidates"}</span>
            {showApplicants ? (
              <ChevronUpIcon className="h-3.5 w-3.5" />
            ) : (
              <ChevronDownIcon className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="text-[11px] text-slate-500">No applicants yet</span>
        )}

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-sky-300 transition-colors"
        >
          <span>View Job</span>
          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Expandable Applicants List */}
      {showApplicants && job.applications && job.applications.length > 0 && (
        <div className="mt-4 border-t border-[#23466d] pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Received Applications ({job.applications.length})
          </h4>
          <div className="space-y-2">
            {job.applications.map((app) => {
              const appliedDate = format(new Date(app.appliedAt), "MMM d, yyyy");
              return (
                <div
                  key={app.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#23466d]/70 bg-[#081a33] p-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-200">
                      {app.user.name || "Candidate"}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <EnvelopeIcon className="h-3 w-3 text-slate-400" />
                      {app.user.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      Applied {appliedDate}
                    </span>
                    <span className="rounded-md border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300 uppercase tracking-wider">
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

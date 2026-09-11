import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage(props: JobDetailsPageProps) {
  const { id } = await props.params;
  const session = await auth();

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      postedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  // Check if current logged-in user is the owner
  const isOwner = Boolean(session?.user?.id && session.user.id === job.postedById);

  // Check if current user has already applied to this job
  const userApplication = session?.user?.id
    ? await prisma.application.findUnique({
        where: {
          jobId_userId: {
            jobId: id,
            userId: session.user.id,
          },
        },
      })
    : null;

  const timeAgo = formatDistanceToNow(new Date(job.postedAt), {
    addSuffix: true,
  });
  const formattedDate = format(new Date(job.postedAt), "MMMM d, yyyy");

  // Split requirements by newline if present to render clean bullet points
  const requirementLines = job.requirements
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-5xl py-10">
      {/* Back to Jobs Link */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-sky-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-base font-semibold text-sky-400">
                <BuildingOfficeIcon className="h-5 w-5 shrink-0" />
                {job.company}
              </span>
              <span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-0.5 text-xs font-semibold text-sky-300">
                {job.type}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-slate-400" />
                {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-slate-400" />
                Posted {timeAgo}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <ApplyButton
              jobId={job.id}
              jobTitle={job.title}
              companyName={job.company}
              isAuthenticated={Boolean(session?.user)}
              isOwner={isOwner}
              initialHasApplied={Boolean(userApplication)}
              initialStatus={userApplication?.status || null}
            />
          </div>
        </div>
      </div>

      {/* Content Layout: Details + Sidebar */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Description and Requirements */}
        <div className="space-y-8 lg:col-span-2">
          {/* Section: Description */}
          <section
            aria-labelledby="job-description-title"
            className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-center gap-2 border-b border-[#23466d] pb-3 text-slate-100">
              <DocumentTextIcon className="h-5 w-5 text-sky-400" />
              <h2 id="job-description-title" className="text-lg font-bold">
                About the Role
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {/* Section: Requirements */}
          <section
            aria-labelledby="job-requirements-title"
            className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-center gap-2 border-b border-[#23466d] pb-3 text-slate-100">
              <ListBulletIcon className="h-5 w-5 text-sky-400" />
              <h2 id="job-requirements-title" className="text-lg font-bold">
                Requirements & Qualifications
              </h2>
            </div>
            <div className="mt-5">
              {requirementLines.length > 1 ? (
                <ul className="space-y-2.5">
                  {requirementLines.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                      <span>{req.replace(/^[•\-\*]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {job.requirements}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Overview Card */}
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-xl space-y-5">
            <h3 className="border-b border-[#23466d] pb-3 text-sm font-bold uppercase tracking-wider text-slate-200">
              Job Overview
            </h3>

            <dl className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <BriefcaseIcon className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
                <div>
                  <dt className="font-semibold text-slate-400">Job Type</dt>
                  <dd className="mt-0.5 font-medium text-slate-200">{job.type}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPinIcon className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
                <div>
                  <dt className="font-semibold text-slate-400">Location</dt>
                  <dd className="mt-0.5 font-medium text-slate-200">{job.location}</dd>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-start gap-3">
                  <CurrencyDollarIcon className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <dt className="font-semibold text-slate-400">Salary</dt>
                    <dd className="mt-0.5 font-medium text-emerald-300">{job.salary}</dd>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <CalendarDaysIcon className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
                <div>
                  <dt className="font-semibold text-slate-400">Date Posted</dt>
                  <dd className="mt-0.5 font-medium text-slate-200">{formattedDate}</dd>
                </div>
              </div>

              {job.postedBy && (
                <div className="flex items-start gap-3 border-t border-[#23466d] pt-4">
                  <UserCircleIcon className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
                  <div>
                    <dt className="font-semibold text-slate-400">Posted By</dt>
                    <dd className="mt-0.5 font-medium text-slate-200">
                      {job.postedBy.name || job.postedBy.email}
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="border-t border-[#23466d] pt-4">
              <ApplyButton
                jobId={job.id}
                jobTitle={job.title}
                companyName={job.company}
                isAuthenticated={Boolean(session?.user)}
                isOwner={isOwner}
                initialHasApplied={Boolean(userApplication)}
                initialStatus={userApplication?.status || null}
                fullWidth
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

import Link from "next/link";
// import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { PostedJobCard } from "@/components/dashboard/PostedJobCard";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import {
	BriefcaseIcon,
	PlusIcon,
	SparklesIcon,
	DocumentCheckIcon,
	LockClosedIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user?.id) {
		return (
			<main className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
				<div className="w-full max-w-md rounded-2xl border border-[#23466d] bg-[#0d2442] p-8 text-center shadow-2xl shadow-black/30">
					<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-400">
						<LockClosedIcon className="h-7 w-7" />
					</div>
					<h1 className="text-2xl font-bold text-slate-100">
						Sign In Required
					</h1>
					<p className="mt-3 text-sm text-slate-300 leading-relaxed">
						You must be logged in to view your dashboard, manage job postings,
						and track applications.
					</p>
					<div className="mt-6 flex flex-col gap-3">
						<Link
							href="/auth/signin?callbackUrl=/dashboard"
							className="flex w-full items-center justify-center rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300"
						>
							Sign In to Continue
						</Link>
						<Link
							href="/jobs"
							className="flex w-full items-center justify-center rounded-xl border border-[#3a5b80] bg-[#102f54] px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-[#153b68]"
						>
							Explore Jobs
						</Link>
					</div>
				</div>
			</main>
		);
	}

	// Fetch both posted jobs and user's applications in parallel
	const [postedJobs, userApplications] = await Promise.all([
		prisma.job.findMany({
			where: { postedById: session.user.id },
			include: {
				_count: {
					select: { applications: true },
				},
				applications: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
					orderBy: { appliedAt: "desc" },
				},
			},
			orderBy: { postedAt: "desc" },
		}),
		prisma.application.findMany({
			where: { userId: session.user.id },
			include: {
				job: {
					select: {
						id: true,
						title: true,
						company: true,
						location: true,
						type: true,
					},
				},
			},
			orderBy: { appliedAt: "desc" },
		}),
	]);

	// Compute stats
	const postedCount = postedJobs.length;
	const applicantsReceived = postedJobs.reduce(
		(sum, j) => sum + j._count.applications,
		0,
	);
	const appliedCount = userApplications.length;
	const pendingCount = userApplications.filter(
		(a) => a.status.toLowerCase() === "pending",
	).length;

	const userName =
		session.user.name || session.user.email?.split("@")[0] || "User";

	return (
		<main className="mx-auto max-w-7xl py-10">
			{/* Header Banner */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
						<SparklesIcon className="h-3.5 w-3.5" />
						Overview
					</div>
					<h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
						Welcome back, {userName}
					</h1>
					<p className="mt-2 text-sm text-slate-300">
						Manage your open listings, view candidates, and track your submitted
						applications.
					</p>
				</div>

				<Link
					href="/jobs/post"
					className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 sm:self-auto shadow-lg shadow-sky-400/20"
				>
					<PlusIcon className="h-4 w-4 stroke-[3]" />
					Post New Job
				</Link>
			</div>

			{/* KPI Metrics */}
			<div className="mb-10">
				<DashboardMetrics
					postedCount={postedCount}
					applicantsReceived={applicantsReceived}
					appliedCount={appliedCount}
					pendingCount={pendingCount}
				/>
			</div>

			{/* Main 2-Column Section (Posted Jobs vs Your Applications) */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Left Column: Posted Jobs */}
				<section aria-labelledby="posted-jobs-title" className="space-y-4">
					<div className="flex items-center justify-between border-b border-[#23466d] pb-3">
						<div className="flex items-center gap-2">
							<BriefcaseIcon className="h-5 w-5 text-sky-400" />
							<h2
								id="posted-jobs-title"
								className="text-lg font-bold text-slate-100"
							>
								Posted Jobs
							</h2>
							<span className="rounded-full bg-[#102f54] px-2.5 py-0.5 text-xs font-semibold text-sky-300">
								{postedCount}
							</span>
						</div>

						<Link
							href="/jobs/post"
							className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
						>
							Post New Job
						</Link>
					</div>

					{postedJobs.length > 0 ? (
						<div className="space-y-4">
							{postedJobs.map((job) => (
								<PostedJobCard
									key={job.id}
									job={{
										id: job.id,
										title: job.title,
										company: job.company,
										location: job.location,
										type: job.type,
										postedAt: job.postedAt,
										applicationsCount: job._count.applications,
										applications: job.applications,
									}}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center rounded-2xl border border-[#23466d] bg-[#0d2442] p-10 text-center shadow-lg">
							<div className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-400 mb-3">
								<BriefcaseIcon className="h-6 w-6" />
							</div>
							<h3 className="text-base font-bold text-slate-100">
								No active job posts
							</h3>
							<p className="mt-1.5 max-w-xs text-xs text-slate-400 leading-relaxed">
								You haven&apos;t published any jobs yet. Create a listing to
								reach qualified candidates.
							</p>
							<div className="mt-5">
								<Link
									href="/jobs/post"
									className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400 px-4 py-2 text-xs font-bold text-[#081a33] hover:bg-sky-300 transition-colors"
								>
									<PlusIcon className="h-3.5 w-3.5 stroke-[3]" />
									Post a Job
								</Link>
							</div>
						</div>
					)}
				</section>

				{/* Right Column: Your Applications */}
				<section aria-labelledby="applications-title" className="space-y-4">
					<div className="flex items-center justify-between border-b border-[#23466d] pb-3">
						<div className="flex items-center gap-2">
							<DocumentCheckIcon className="h-5 w-5 text-emerald-400" />
							<h2
								id="applications-title"
								className="text-lg font-bold text-slate-100"
							>
								Your Applications
							</h2>
							<span className="rounded-full bg-[#102f54] px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
								{appliedCount}
							</span>
						</div>

						<Link
							href="/jobs"
							className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
						>
							Browse Jobs
						</Link>
					</div>

					{userApplications.length > 0 ? (
						<div className="space-y-4">
							{userApplications.map((app) => (
								<ApplicationCard key={app.id} application={app} />
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center rounded-2xl border border-[#23466d] bg-[#0d2442] p-10 text-center shadow-lg">
							<div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 mb-3">
								<MagnifyingGlassIcon className="h-6 w-6" />
							</div>
							<h3 className="text-base font-bold text-slate-100">
								No applications submitted
							</h3>
							<p className="mt-1.5 max-w-xs text-xs text-slate-400 leading-relaxed">
								You haven&apos;t applied to any jobs yet. Browse our active
								openings to find your next role.
							</p>
							<div className="mt-5">
								<Link
									href="/jobs"
									className="inline-flex items-center gap-1.5 rounded-lg border border-[#3a5b80] bg-[#102f54] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#153b68] transition-colors"
								>
									<MagnifyingGlassIcon className="h-3.5 w-3.5" />
									Explore Jobs
								</Link>
							</div>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}

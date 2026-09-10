import Link from "next/link";
import prisma from "@/lib/prisma";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobSearchAndSort } from "@/components/jobs/JobSearchAndSort";
import { JobPagination } from "@/components/jobs/JobPagination";
import {
	BriefcaseIcon,
	PlusIcon,
	SparklesIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Prisma } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";

interface JobsPageProps {
	searchParams: Promise<{
		q?: string;
		type?: string;
		location?: string;
		date?: string;
		sort?: string;
		page?: string;
	}>;
}

const PAGE_SIZE = 6;

export default async function JobsPage(props: JobsPageProps) {
	const searchParams = await props.searchParams;

	const query = searchParams.q?.trim() || "";
	const type = searchParams.type?.trim() || "";
	const location = searchParams.location?.trim() || "";
	const dateRange = searchParams.date?.trim() || "";
	const sort = searchParams.sort?.trim() || "newest";
	const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

	// Build Prisma WhereInput filter
	const where: Prisma.JobWhereInput = {};

	if (query) {
		where.OR = [
			{ title: { contains: query, mode: "insensitive" } },
			{ company: { contains: query, mode: "insensitive" } },
			{ description: { contains: query, mode: "insensitive" } },
			{ requirements: { contains: query, mode: "insensitive" } },
		];
	}

	if (type) {
		where.type = type;
	}

	if (location) {
		where.location = { contains: location, mode: "insensitive" };
	}

	if (dateRange) {
		const now = Date.now();
		if (dateRange === "24h") {
			where.postedAt = { gte: new Date(now - 24 * 60 * 60 * 1000) };
		} else if (dateRange === "7d") {
			where.postedAt = { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
		} else if (dateRange === "30d") {
			where.postedAt = { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
		}
	}

	// Build OrderBy
	let orderBy: Prisma.JobOrderByWithRelationInput = { postedAt: "desc" };
	if (sort === "oldest") {
		orderBy = { postedAt: "asc" };
	} else if (sort === "alphabetical") {
		orderBy = { company: "asc" };
	}

	// Query database in parallel for total count and paginated items
	const [totalJobs, jobs] = await Promise.all([
		prisma.job.count({ where }),
		prisma.job.findMany({
			where,
			orderBy,
			skip: (currentPage - 1) * PAGE_SIZE,
			take: PAGE_SIZE,
			include: {
				postedBy: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		}),
	]);

	const totalPages = Math.ceil(totalJobs / PAGE_SIZE);

	return (
		<main className="mx-auto max-w-7xl py-10">
			{/* Header Banner */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
						<SparklesIcon className="h-3.5 w-3.5" />
						Explore Careers
					</div>
					<h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
						Browse Job Opportunities
					</h1>
					<p className="mt-2 text-sm text-slate-300">
						Discover your next role from top companies hiring right now.
					</p>
				</div>

				<Link
					href="/jobs/post"
					className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 sm:self-auto shadow-lg shadow-sky-400/20"
				>
					<PlusIcon className="h-4 w-4 stroke-[3]" />
					Post a Job
				</Link>
			</div>

			{/* Search & Sort Controls */}
			<div className="mb-8">
				<JobSearchAndSort />
			</div>

			{/* Main Grid: Sidebar Filters + Job List */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				{/* Filter Sidebar */}
				<aside className="lg:col-span-1">
					<div className="sticky top-6">
						<JobFilters />
					</div>
				</aside>

				{/* Job Listings Column */}
				<section className="lg:col-span-3">
					{/* Results Bar */}
					<div className="mb-4 flex items-center justify-between text-xs text-slate-400">
						<span>
							Showing{" "}
							<strong className="text-slate-200">
								{totalJobs === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
							</strong>{" "}
							to{" "}
							<strong className="text-slate-200">
								{Math.min(currentPage * PAGE_SIZE, totalJobs)}
							</strong>{" "}
							of <strong className="text-slate-200">{totalJobs}</strong> jobs
						</span>
					</div>

					{/* Job Cards or Empty State */}
					{jobs.length > 0 ? (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{jobs.map((job) => (
								<JobCard key={job.id} job={job} />
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center rounded-2xl border border-[#23466d] bg-[#0d2442] p-12 text-center shadow-xl">
							<div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-400 mb-4">
								<MagnifyingGlassIcon className="h-7 w-7" />
							</div>
							<h3 className="text-lg font-bold text-slate-100">
								No jobs found
							</h3>
							<p className="mt-2 max-w-sm text-sm text-slate-400">
								We&apos; couldn&apos;t find any job postings matching your
								current search or filter criteria.
							</p>
							<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
								<Link
									href="/jobs"
									className="rounded-lg border border-[#3a5b80] bg-[#102f54] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#153b68] transition-colors"
								>
									Clear All Filters
								</Link>

								<Link
									href="/jobs/post"
									className="flex items-center gap-1.5 rounded-lg bg-sky-400 px-4 py-2 text-xs font-bold text-[#081a33] hover:bg-sky-300 transition-colors"
								>
									<BriefcaseIcon className="h-3.5 w-3.5" />
									Post the First Job
								</Link>
							</div>
						</div>
					)}
					{/* Pagination */}
					<JobPagination currentPage={currentPage} totalPages={totalPages} />
				</section>
			</div>
		</main>
	);
}

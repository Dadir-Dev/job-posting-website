import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
	BriefcaseIcon,
	BuildingOfficeIcon,
	MapPinIcon,
	CurrencyDollarIcon,
	ClockIcon,
	ArrowRightIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";

export interface JobCardProps {
	job: {
		id: string;
		title: string;
		company: string;
		location: string;
		type: string;
		salary: string | null;
		description: string;
		postedAt: Date | string;
		postedBy?: {
			name?: string | null;
			email?: string | null;
		} | null;
	};
}

export function JobCard({ job }: JobCardProps) {
	const timeAgo = formatDistanceToNow(new Date(job.postedAt), {
		addSuffix: true,
	});

	const posterName =
		job.postedBy?.name || job.postedBy?.email?.split("@")[0] || null;

	return (
		<article className="group relative flex flex-col justify-between rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-2xl hover:shadow-sky-950/30">
			<div>
				{/* Top bar: Company & Type Badge */}
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
						<BuildingOfficeIcon className="h-4 w-4 shrink-0" />
						<span className="truncate">{job.company}</span>
					</div>
					<span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
						<BriefcaseIcon className="h-4 w-4 shrink-0" />
						{job.type}
					</span>
				</div>

				{/* Title */}
				<h3 className="mt-3 text-xl font-bold tracking-tight text-slate-100 transition-colors group-hover:text-sky-300">
					<Link href={`/jobs/${job.id}`} className="focus:outline-none">
						<span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
						{job.title}
					</Link>
				</h3>

				{/* Meta tags: Location & Salary */}
				<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
					<span className="flex items-center gap-1">
						<MapPinIcon className="h-3.5 w-3.5 text-slate-400" />
						{job.location}
					</span>
					{job.salary && (
						<span className="flex items-center gap-1 font-medium text-emerald-400">
							<CurrencyDollarIcon className="h-3.5 w-3.5" />
							{job.salary}
						</span>
					)}
				</div>

				{/* Description snippet */}
				<p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-300">
					{job.description}
				</p>
			</div>

			{/* Footer: Posted time, Poster name & View details CTA */}
			<div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#23466d]/70 pt-4 text-xs">
				<div className="flex items-center gap-3 text-slate-400">
					<span className="flex items-center gap-1.5">
						<ClockIcon className="h-3.5 w-3.5 text-slate-400" />
						{timeAgo}
					</span>
					{posterName && (
						<span className="flex items-center gap-1 border-l border-[#23466d] pl-3 text-slate-300">
							<UserCircleIcon className="h-3.5 w-3.5 text-sky-400" />
							<span className="truncate max-w-[130px]">{posterName}</span>
						</span>
					)}
				</div>
				<span className="inline-flex items-center gap-1 font-semibold text-sky-400 transition-colors group-hover:text-sky-300">
					View Details
					<ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
				</span>
			</div>
		</article>
	);
}

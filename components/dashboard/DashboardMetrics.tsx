import {
  BriefcaseIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface DashboardMetricsProps {
  postedCount: number;
  applicantsReceived: number;
  appliedCount: number;
  pendingCount: number;
}

export function DashboardMetrics({
  postedCount,
  applicantsReceived,
  appliedCount,
  pendingCount,
}: DashboardMetricsProps) {
  const cards = [
    {
      label: "Jobs Posted",
      value: postedCount,
      description: "Active listings by you",
      icon: BriefcaseIcon,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
      borderColor: "border-sky-400/20",
    },
    {
      label: "Applicants Received",
      value: applicantsReceived,
      description: "Candidates for your listings",
      icon: UserGroupIcon,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-400/20",
    },
    {
      label: "Your Applications",
      value: appliedCount,
      description: "Positions applied to",
      icon: DocumentCheckIcon,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Awaiting Review",
      value: pendingCount,
      description: "Pending decisions",
      icon: ClockIcon,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 shadow-xl transition-all duration-300 hover:border-sky-400/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {card.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.borderColor} ${card.bgColor} ${card.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
              {card.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}

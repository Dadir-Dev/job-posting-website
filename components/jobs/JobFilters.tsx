"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { JOB_TYPES } from "@/lib/constants";
import {
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const DATE_OPTIONS = [
  { label: "Any time", value: "" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past week", value: "7d" },
  { label: "Past month", value: "30d" },
];

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const currentType = searchParams.get("type") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentDate = searchParams.get("date") || "";

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Always reset page to 1 when filters change
      if (!("page" in paramsToUpdate)) {
        params.delete("page");
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleTypeChange = (type: string) => {
    const nextType = currentType === type ? "" : type;
    const queryString = createQueryString({ type: nextType });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const location = (formData.get("location") as string)?.trim() || "";
    const queryString = createQueryString({ location });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const handleDateChange = (date: string) => {
    const queryString = createQueryString({ date });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get("q");
    const sort = searchParams.get("sort");
    if (query) params.set("q", query);
    if (sort) params.set("sort", sort);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  const hasActiveFilters = Boolean(currentType || currentLocation || currentDate);

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpenMobile((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-[#23466d] bg-[#0d2442] px-4 py-3 text-sm font-semibold text-slate-200 shadow-md"
        >
          <span className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-sky-400" />
            Filters {hasActiveFilters && "(Active)"}
          </span>
          {isOpenMobile ? (
            <ChevronUpIcon className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Filter Sidebar Container */}
      <div
        className={`${
          isOpenMobile ? "block" : "hidden"
        } lg:block rounded-2xl border border-[#23466d] bg-[#0d2442] p-5 shadow-xl space-y-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#23466d] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <FunnelIcon className="h-4 w-4 text-sky-400" />
            <span>Filter Jobs</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Filter 1: Job Type */}
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <BriefcaseIcon className="h-3.5 w-3.5 text-sky-400" />
            Job Type
          </h4>
          <div className="space-y-2">
            {JOB_TYPES.map((type) => {
              const isSelected = currentType === type;
              return (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-sky-500/20 text-sky-200 border border-sky-500/40"
                      : "text-slate-300 hover:bg-[#102f54] hover:text-white border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTypeChange(type)}
                      className="h-3.5 w-3.5 rounded border-[#3a5b80] bg-[#081a33] text-sky-400 focus:ring-sky-400/40"
                    />
                    <span>{type}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Filter 2: Location Filter */}
        <div className="border-t border-[#23466d] pt-5">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <MapPinIcon className="h-3.5 w-3.5 text-sky-400" />
            Location
          </h4>
          <form onSubmit={handleLocationChange} className="relative">
            <input
              type="text"
              name="location"
              key={currentLocation}
              defaultValue={currentLocation}
              placeholder="e.g. Remote, NY, London..."
              className="w-full rounded-lg border border-[#3a5b80] bg-[#081a33] py-2 pl-3 pr-8 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
            />
            {currentLocation ? (
              <button
                type="button"
                onClick={() => {
                  const queryString = createQueryString({ location: "" });
                  router.push(`${pathname}?${queryString}`, { scroll: false });
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                aria-label="Clear location"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </form>
        </div>

        {/* Filter 3: Date Posted */}
        <div className="border-t border-[#23466d] pt-5">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <CalendarDaysIcon className="h-3.5 w-3.5 text-sky-400" />
            Date Posted
          </h4>
          <div className="space-y-1.5">
            {DATE_OPTIONS.map((opt) => {
              const isSelected = currentDate === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleDateChange(opt.value)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-sky-500/20 text-sky-200 border border-sky-500/40 font-semibold"
                      : "text-slate-300 hover:bg-[#102f54] hover:text-white border border-transparent"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

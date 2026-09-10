"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

export function JobSearchAndSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

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

      // Always reset page to 1 on new search or sort change
      params.delete("page");

      return params.toString();
    },
    [searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const queryString = createQueryString({ q: searchTerm.trim() });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    startTransition(() => {
      const queryString = createQueryString({ q: "" });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      const queryString = createQueryString({ sort: newSort });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex-1 max-w-2xl"
      >
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company name, or keywords..."
            className="w-full rounded-xl border border-[#3a5b80] bg-[#0d2442] py-3 pl-10 pr-20 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 shadow-lg shadow-black/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-14 top-3.5 text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-sky-400 px-3.5 text-xs font-bold text-[#081a33] transition-colors hover:bg-sky-300 focus:outline-none"
          >
            Search
          </button>
        </div>
      </form>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <label
          htmlFor="sort-select"
          className="flex items-center gap-1 text-xs font-medium text-slate-400"
        >
          <ArrowsUpDownIcon className="h-3.5 w-3.5 text-sky-400" />
          <span>Sort:</span>
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none rounded-lg border border-[#3a5b80] bg-[#0d2442] py-2 pl-3 pr-8 text-xs font-medium text-slate-200 outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
          >
            <option value="newest" className="bg-[#0d2442] text-slate-100">
              Newest First
            </option>
            <option value="oldest" className="bg-[#0d2442] text-slate-100">
              Oldest First
            </option>
            <option value="alphabetical" className="bg-[#0d2442] text-slate-100">
              Company (A to Z)
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function JobPagination({ currentPage, totalPages }: JobPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Build page numbers array (showing current, adjacent, and boundaries)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#23466d] bg-[#0d2442] text-slate-300 transition-colors hover:border-sky-400 hover:text-sky-300"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-[#23466d]/40 bg-[#0d2442]/50 text-slate-600"
          aria-disabled="true"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </span>
      )}

      {/* Numbered Buttons */}
      {getPageNumbers().map((page, idx) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex h-9 w-9 items-center justify-center text-xs text-slate-500"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return isCurrent ? (
          <span
            key={page}
            aria-current="page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400 text-xs font-bold text-[#081a33] shadow-md shadow-sky-400/20"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={createPageUrl(page)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#23466d] bg-[#0d2442] text-xs font-medium text-slate-300 transition-colors hover:border-sky-400 hover:text-sky-300"
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#23466d] bg-[#0d2442] text-slate-300 transition-colors hover:border-sky-400 hover:text-sky-300"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-[#23466d]/40 bg-[#0d2442]/50 text-slate-600"
          aria-disabled="true"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

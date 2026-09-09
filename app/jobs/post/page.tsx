"use client";

import { useState, useTransition, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ListBulletIcon,
  SparklesIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { createJobAction } from "@/lib/actions/jobs";
import { JOB_TYPES, JobType } from "@/lib/constants";

interface FormValues {
  title: string;
  company: string;
  location: string;
  type: JobType | "";
  salary: string;
  description: string;
  requirements: string;
}

interface FormErrors {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  salary?: string;
  description?: string;
  requirements?: string;
  general?: string;
}

const initialValues: FormValues = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  description: "",
  requirements: "",
};

export default function PostJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const validate = (currentValues: FormValues): FormErrors => {
    const errs: FormErrors = {};

    if (!currentValues.title.trim()) {
      errs.title = "Job title is required.";
    } else if (currentValues.title.trim().length < 3) {
      errs.title = "Job title must be at least 3 characters.";
    }

    if (!currentValues.company.trim()) {
      errs.company = "Company name is required.";
    } else if (currentValues.company.trim().length < 2) {
      errs.company = "Company name must be at least 2 characters.";
    }

    if (!currentValues.location.trim()) {
      errs.location = "Location is required.";
    } else if (currentValues.location.trim().length < 2) {
      errs.location = "Location must be at least 2 characters.";
    }

    if (!currentValues.type) {
      errs.type = "Please select a job type.";
    }

    if (!currentValues.description.trim()) {
      errs.description = "Job description is required.";
    } else if (currentValues.description.trim().length < 20) {
      errs.description = "Job description must be at least 20 characters.";
    }

    if (!currentValues.requirements.trim()) {
      errs.requirements = "Job requirements are required.";
    } else if (currentValues.requirements.trim().length < 10) {
      errs.requirements = "Job requirements must be at least 10 characters.";
    }

    return errs;
  };

  const handleChange = (
    field: keyof FormValues,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate(values);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({
      title: true,
      company: true,
      location: true,
      type: true,
      salary: true,
      description: true,
      requirements: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = document.querySelector(
        "[aria-invalid='true']"
      ) as HTMLElement | null;
      firstErrorField?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("company", values.company);
    formData.append("location", values.location);
    formData.append("type", values.type);
    formData.append("salary", values.salary);
    formData.append("description", values.description);
    formData.append("requirements", values.requirements);

    startTransition(async () => {
      try {
        const result = await createJobAction(null, formData);

        if (result.success) {
          setIsSubmittedSuccessfully(true);
          setTimeout(() => {
            router.push("/jobs");
            router.refresh();
          }, 1500);
        } else if (result.errors) {
          setErrors(result.errors);
        }
      } catch {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <main className="flex min-h-[calc(100vh-120px)] items-center justify-center py-12">
        <section
          className="w-full max-w-md rounded-2xl border border-[#23466d] bg-[#0d2442] p-8 text-center shadow-2xl shadow-black/30"
          aria-labelledby="auth-required-title"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <BriefcaseIcon className="h-7 w-7" />
          </div>
          <h1 id="auth-required-title" className="text-2xl font-bold text-slate-100">
            Sign In Required
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            You need to be signed in to your account before posting a new job opportunity.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="flex w-full items-center justify-center rounded-lg bg-sky-400 px-4 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-[#0d2442]"
            >
              Sign In to Continue
            </Link>
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded-lg border border-[#3a5b80] bg-[#102f54] px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-[#153b68]"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl py-10">
      {/* Header breadcrumb & intro */}
      <div className="mb-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-sky-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Jobs
        </Link>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <SparklesIcon className="h-3.5 w-3.5" />
              Recruitment
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
              Post a New Job
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Reach thousands of talented job seekers by listing your open position below.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {isSubmittedSuccessfully && (
        <div
          role="status"
          className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200 shadow-lg"
        >
          <CheckCircleIcon className="h-6 w-6 shrink-0 text-emerald-400" />
          <div>
            <p className="font-semibold text-emerald-100">Job posted successfully!</p>
            <p className="text-xs text-emerald-300/90">
              Redirecting you to the job listings...
            </p>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {errors.general && (
        <div
          role="alert"
          className="mb-8 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200 shadow-lg"
        >
          <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-rose-400" />
          <p className="text-sm font-medium">{errors.general}</p>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-[#23466d] bg-[#0d2442] p-6 shadow-2xl shadow-black/25 sm:p-10"
      >
        <div className="space-y-8">
          {/* Section: Basic Job Information */}
          <div>
            <div className="border-b border-[#23466d] pb-3">
              <h2 className="text-lg font-semibold text-slate-100">
                Position Overview
              </h2>
              <p className="text-xs text-slate-400">
                Basic details about the role and hiring company
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Job Title */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <BriefcaseIcon className="h-4 w-4 text-sky-400" />
                  Job Title <span className="text-sky-400">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={values.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  onBlur={() => handleBlur("title")}
                  placeholder="e.g. Senior Full Stack Developer"
                  aria-invalid={Boolean(touched.title && errors.title)}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  className={`w-full rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 ${
                    touched.title && errors.title
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#3a5b80] focus:border-sky-400"
                  }`}
                />
                {touched.title && errors.title && (
                  <p id="title-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <BuildingOfficeIcon className="h-4 w-4 text-sky-400" />
                  Company Name <span className="text-sky-400">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={values.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  onBlur={() => handleBlur("company")}
                  placeholder="e.g. Acme Tech Innovations"
                  aria-invalid={Boolean(touched.company && errors.company)}
                  aria-describedby={errors.company ? "company-error" : undefined}
                  className={`w-full rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 ${
                    touched.company && errors.company
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#3a5b80] focus:border-sky-400"
                  }`}
                />
                {touched.company && errors.company && (
                  <p id="company-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.company}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <MapPinIcon className="h-4 w-4 text-sky-400" />
                  Location <span className="text-sky-400">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={values.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  onBlur={() => handleBlur("location")}
                  placeholder="e.g. San Francisco, CA or Remote"
                  aria-invalid={Boolean(touched.location && errors.location)}
                  aria-describedby={errors.location ? "location-error" : undefined}
                  className={`w-full rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 ${
                    touched.location && errors.location
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#3a5b80] focus:border-sky-400"
                  }`}
                />
                {touched.location && errors.location && (
                  <p id="location-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <BriefcaseIcon className="h-4 w-4 text-sky-400" />
                  Job Type <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={values.type}
                    onChange={(e) => handleChange("type", e.target.value as JobType)}
                    onBlur={() => handleBlur("type")}
                    aria-invalid={Boolean(touched.type && errors.type)}
                    aria-describedby={errors.type ? "type-error" : undefined}
                    className={`w-full appearance-none rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 ${
                      touched.type && errors.type
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-[#3a5b80] focus:border-sky-400"
                    }`}
                  >
                    {JOB_TYPES.map((typeOption) => (
                      <option
                        key={typeOption}
                        value={typeOption}
                        className="bg-[#081a33] text-slate-100 py-2"
                      >
                        {typeOption}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {touched.type && errors.type && (
                  <p id="type-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.type}
                  </p>
                )}
              </div>

              {/* Salary (Optional) */}
              <div>
                <label
                  htmlFor="salary"
                  className="mb-2 flex items-center justify-between text-sm font-medium text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-sky-400" />
                    Salary
                  </span>
                  <span className="text-xs font-normal text-slate-400">Optional</span>
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={values.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                  onBlur={() => handleBlur("salary")}
                  placeholder="e.g. $120,000 - $140,000 / year"
                  aria-invalid={Boolean(touched.salary && errors.salary)}
                  aria-describedby={errors.salary ? "salary-error" : undefined}
                  className={`w-full rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 ${
                    touched.salary && errors.salary
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#3a5b80] focus:border-sky-400"
                  }`}
                />
                {touched.salary && errors.salary && (
                  <p id="salary-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.salary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Job Details & Requirements */}
          <div>
            <div className="border-b border-[#23466d] pb-3">
              <h2 className="text-lg font-semibold text-slate-100">
                Detailed Information
              </h2>
              <p className="text-xs text-slate-400">
                Provide comprehensive information to attract the right candidates
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {/* Job Description */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="flex items-center gap-2 text-sm font-medium text-slate-200"
                  >
                    <DocumentTextIcon className="h-4 w-4 text-sky-400" />
                    Job Description <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {values.description.length} characters
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={values.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  placeholder="Describe the role, day-to-day responsibilities, mission, team structure, and company perks..."
                  aria-invalid={Boolean(touched.description && errors.description)}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  className={`w-full rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 resize-y leading-relaxed ${
                    touched.description && errors.description
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#3a5b80] focus:border-sky-400"
                  }`}
                />
                {touched.description && errors.description && (
                  <p id="description-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="requirements"
                    className="flex items-center gap-2 text-sm font-medium text-slate-200"
                  >
                    <ListBulletIcon className="h-4 w-4 text-sky-400" />
                    Requirements & Qualifications <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {values.requirements.length} characters
                  </span>
                </div>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  value={values.requirements}
                  onChange={(e) => handleChange("requirements", e.target.value)}
                  onBlur={() => handleBlur("requirements")}
                  placeholder="List key skills, experience level, technologies (e.g. React, Next.js, TypeScript), education, or certifications..."
                  aria-invalid={Boolean(touched.requirements && errors.requirements)}
                  aria-describedby={errors.requirements ? "requirements-error" : undefined}
                  className={`w-full rounded-lg border bg-[#081a33] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-sky-400/30 resize-y leading-relaxed ${
                    touched.requirements && errors.requirements
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#3a5b80] focus:border-sky-400"
                  }`}
                />
                {touched.requirements && errors.requirements && (
                  <p id="requirements-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.requirements}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#23466d] pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/jobs"
              className="flex items-center justify-center rounded-lg border border-[#3a5b80] bg-[#102f54] px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-[#153b68] focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending || isSubmittedSuccessfully}
              className="flex items-center justify-center gap-2 rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-[#081a33] transition-colors hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-[#0d2442] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#081a33] border-t-transparent" />
                  <span>Publishing Job...</span>
                </>
              ) : isSubmittedSuccessfully ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Published!</span>
                </>
              ) : (
                <span>Publish Job Post</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

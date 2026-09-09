"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { JOB_TYPES, JobType, CreateJobState } from "@/lib/constants";

export async function createJobAction(
  prevState: CreateJobState | null,
  formData: FormData
): Promise<CreateJobState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        general: "You must be signed in to post a job.",
      },
    };
  }

  const title = (formData.get("title") as string)?.trim() || "";
  const company = (formData.get("company") as string)?.trim() || "";
  const location = (formData.get("location") as string)?.trim() || "";
  const type = (formData.get("type") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const requirements = (formData.get("requirements") as string)?.trim() || "";
  const salary = (formData.get("salary") as string)?.trim() || null;

  const errors: NonNullable<CreateJobState["errors"]> = {};

  if (!title) {
    errors.title = "Job title is required.";
  } else if (title.length < 3) {
    errors.title = "Job title must be at least 3 characters.";
  } else if (title.length > 100) {
    errors.title = "Job title must not exceed 100 characters.";
  }

  if (!company) {
    errors.company = "Company name is required.";
  } else if (company.length < 2) {
    errors.company = "Company name must be at least 2 characters.";
  } else if (company.length > 100) {
    errors.company = "Company name must not exceed 100 characters.";
  }

  if (!location) {
    errors.location = "Location is required.";
  } else if (location.length < 2) {
    errors.location = "Location must be at least 2 characters.";
  } else if (location.length > 100) {
    errors.location = "Location must not exceed 100 characters.";
  }

  if (!type) {
    errors.type = "Please select a job type.";
  } else if (!JOB_TYPES.includes(type as JobType)) {
    errors.type = "Please select a valid job type from the list.";
  }

  if (!description) {
    errors.description = "Job description is required.";
  } else if (description.length < 20) {
    errors.description = "Job description must be at least 20 characters.";
  }

  if (!requirements) {
    errors.requirements = "Job requirements are required.";
  } else if (requirements.length < 10) {
    errors.requirements = "Job requirements must be at least 10 characters.";
  }

  if (salary && salary.length > 60) {
    errors.salary = "Salary must not exceed 60 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary: salary || null,
        postedById: session.user.id,
      },
    });

    return {
      success: true,
      jobId: newJob.id,
    };
  } catch (error) {
    console.error("Failed to create job:", error);
    return {
      success: false,
      errors: {
        general: "Failed to post job. Please try again.",
      },
    };
  }
}

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ApplyJobResult {
  success: boolean;
  message?: string;
  error?: string;
  applicationId?: string;
}

export async function applyToJobAction(jobId: string): Promise<ApplyJobResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be signed in to apply for this job.",
    };
  }

  if (!jobId || typeof jobId !== "string") {
    return {
      success: false,
      error: "Invalid job ID.",
    };
  }

  try {
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, postedById: true, title: true },
    });

    if (!job) {
      return {
        success: false,
        error: "This job listing no longer exists.",
      };
    }

    // Prevent user from applying to their own job
    if (job.postedById === session.user.id) {
      return {
        success: false,
        error: "You cannot apply to a job that you posted.",
      };
    }

    // Create the application record in Prisma
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        status: "pending",
      },
    });

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Your application has been submitted successfully!",
      applicationId: application.id,
    };
  } catch (err: unknown) {
    // Check for Prisma unique constraint violation (P2002 on @@unique([jobId, userId]))
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "You have already applied for this position.",
      };
    }

    console.error("Failed to apply for job:", err);
    return {
      success: false,
      error: "An unexpected error occurred while submitting your application. Please try again.",
    };
  }
}

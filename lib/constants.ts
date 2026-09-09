export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Internship",
  "Freelance",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export type CreateJobState = {
  success: boolean;
  jobId?: string;
  errors?: {
    title?: string;
    company?: string;
    location?: string;
    type?: string;
    description?: string;
    requirements?: string;
    salary?: string;
    general?: string;
  };
};

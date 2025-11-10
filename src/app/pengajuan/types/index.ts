import type z from "zod";

import type { UpdateSchema, ListSchema } from "../schema";

export type ListResponse = z.infer<typeof ListSchema>[];
export type DetailResponse = z.infer<typeof ListSchema>;
export type FormPayload = z.infer<typeof UpdateSchema>;

export type SummaryType = {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  TOTAL: number;
}

export enum SubmissionStatus {
  REJECTED = "REJECTED",
  REVISION_REQUESTED = "REVISION_REQUESTED",
  APPROVED = "APPROVED",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESUBMITTED = "RESUBMITTED",
}

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  [SubmissionStatus.REJECTED]: "Ditolak",
  [SubmissionStatus.REVISION_REQUESTED]: "Revisi",
  [SubmissionStatus.APPROVED]: "Disetujui",
  [SubmissionStatus.UNDER_REVIEW]: "Diajukan",
  [SubmissionStatus.RESUBMITTED]: "Diajukan Ulang",
};

export const submissionStatusColors: Record<SubmissionStatus, string> = {
  [SubmissionStatus.REJECTED]: "bg-red-500 text-white",
  [SubmissionStatus.REVISION_REQUESTED]: "bg-yellow-500 text-white",
  [SubmissionStatus.APPROVED]: "bg-green-500 text-white",
  [SubmissionStatus.UNDER_REVIEW]: "bg-neutral-500 text-white",
  [SubmissionStatus.RESUBMITTED]: "bg-orange-500 text-white",
};

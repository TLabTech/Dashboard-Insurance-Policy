import { z } from "zod"
import { SubmissionStatus } from "../types"

export const ListSchema = z.object({
  id: z.number(),
  submissionNumber: z.string(),
  policyHolderName: z.string(),
  policyHolderDOB: z.date(),
  policyHolderNik: z.string(),
  productID: z.string(),
  sumAssured: z.string(),
  annualPremium: z.string(),
  paymentFreq: z.string(),
  document: z.string(),
  status: z.enum(SubmissionStatus),
  notes: z.string(),
  createdBy: z.object({
      id: z.number(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      isActive: z.boolean(),
      roleID: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const FormSchema = z.object({
  policyHolderName: z.string().min(3, {
    message: "Nama wajib diisi"
  }),
  policyHolderDOB: z.date({ error: "Tanggal Lahir wajib diisi" }),
  policyHolderNik: z.string().min(16, {
    message: "NIK harus 16 digit"
  }).max(16, {
    message: "NIK harus 16 digit"
  }),
  productID: z.string().refine((value) => value !== "", {
    message: "Produk wajib diisi",
  }),
  sumAssured: z.string().min(3, {
    message: "Uang pertanggungan wajib diisi"
  }),
  annualPremium: z.string().optional(),
  paymentFreq: z.string().refine((value) => value !== "", {
    message: "Frekuensi pembayaran wajib diisi",
  }),
  status: z.string(),
  notes: z.string().min(1, {
    message: "Catatan wajib diisi"
  }),
})

const DocumentSchema = z
  .instanceof(File, { message: "Dokumen wajib diisi" })
  .refine((file) => file && file.size < (2 * 1000000), "Dokumen tidak boleh lebih dari 2MB")

export const CreateSchema = FormSchema.extend({
  document: DocumentSchema,
})

export const UpdateSchema = FormSchema.extend({
  document: DocumentSchema.optional(),
})

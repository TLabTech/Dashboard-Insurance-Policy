import z from "zod";

export const ListSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isActive: z.boolean(),
  roleID: z.number(),
  branchID: z.number(),
  role: z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const FormSchema = z.object({
  email: z.email({ message: "Email wajib diisi" }),
  firstName: z.string().min(3, { message: "Nama Depan wajib diisi" }),
  lastName: z.string().min(3, { message: "Nama Belakang wajib diisi" }),
  password: z.union([
    z.literal(""),
    z.string().min(6, { message: "Password minimal 6 karakter" })
    .regex(/[A-Z]/, { message: "Kata Sandi harus mengandung minimal 1 huruf besar" })
    .regex(/[0-9]/, { message: "Kata Sandi harus mengandung minimal 1 angka" })
    .regex(/[^A-Za-z0-9]/, { message: "Kata Sandi harus mengandung minimal 1 simbol" }),
  ]).optional(),
  // password: z.string()
  //   .min(6, { message: "Password minimal 6 karakter" })
  //   .max(10, { message: "Password maksimal 10 karakter" }),
  roleID: z.string().min(1, { message: "Role wajib diisi" }),
  branchID: z.string().min(1, { message: "Cabang wajib diisi" }),
});

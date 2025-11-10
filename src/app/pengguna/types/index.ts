import type z from "zod";
import type { FormSchema, ListSchema } from "../schema";

export type ListResponse = z.infer<typeof ListSchema>[];
export type DetailResponse = z.infer<typeof ListSchema>;
export type FormPayload = z.infer<typeof FormSchema>;

export type RolesResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

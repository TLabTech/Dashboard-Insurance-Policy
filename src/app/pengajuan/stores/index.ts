import { create } from "zustand"

export type TypeSubmissionStore = {
  filters: {
    page: number;
    limit: number;
    search?: string;
    createdBy?: string;
    productID?: string;
    status?: string;
  }
  setFilters: (filters: TypeSubmissionStore['filters']) => void
}

export const useSubmissionStore = create<TypeSubmissionStore>((set) => ({
  filters: {
    page: 1,
    limit: 10
  },
  setFilters: (filters) => set({ filters }),
}));

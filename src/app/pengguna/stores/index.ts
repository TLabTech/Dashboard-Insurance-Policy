import { create } from "zustand"

export type TypeUserStore = {
  filters: {
    page: number;
    limit: number;
    search?: string;
    roleID?: string;
  }
  setFilters: (filters: TypeUserStore['filters']) => void
}

export const useUserStore = create<TypeUserStore>((set) => ({
  filters: {
    page: 1,
    limit: 10
  },
  setFilters: (filters) => set({ filters }),
}));

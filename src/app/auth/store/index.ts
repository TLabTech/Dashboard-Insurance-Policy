import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import type { DetailResponse } from "@/app/pengguna/types"

export type TypeAuthStore = {
  token: {
    access_token: string;
    refresh_token: string;
  } | null,
  setToken: (token: TypeAuthStore['token']) => void

  user: DetailResponse | null
  setUser: (user: DetailResponse | null) => void
}

export const useAuthStore = create<TypeAuthStore>()(persist((set) => ({
  /* auth token */
  token: {
    access_token: '',
    refresh_token: ''
  },
  setToken: (token: TypeAuthStore['token']) => set({ token }),

  /* user detail */
  user: null,
  setUser: (user: DetailResponse | null) => set({ user })
}), {
  name: 'auth-storage',
  storage: createJSONStorage(() => localStorage)
}));

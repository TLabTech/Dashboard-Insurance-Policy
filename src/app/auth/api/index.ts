import { api } from "@/api/axios"

type LoginPayload = {
  email: string;
  password: string;
}

export const login = async ({email, password}: LoginPayload) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    })

    return response.data
  } catch (err) {
    throw err;
  }
}

export const refreshToken = async (refresh_token: string) => {
  const response = await api.post('/auth/refresh', {
    refresh_token
  })

  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/auth/profile');

  return response.data
}
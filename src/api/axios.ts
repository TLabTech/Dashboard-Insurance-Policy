import axios, { AxiosError } from "axios";

import { Env } from "@/constants/env";
import { useAuthStore } from "@/app/auth/store";
import { refreshToken } from "@/app/auth/api";

const api = axios.create({
  baseURL: Env.API_URL,
  timeout: 10000
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore.getState();

  if (auth.token?.access_token) {
    config.headers.Authorization = `Bearer ${auth.token?.access_token}`;
  }

  return config;
})

api.interceptors.response.use(
async (response) => response,
async (error) => {
  const originalRequest = error.config;

  // Prevent looping on refresh token failure
  if (originalRequest._retry) {
    return Promise.reject(error);
  }

  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  const err = error as AxiosError;
  
  if (err.response && err.response.status > 500) {
    console.error("Something went wrong");
    return Promise.reject(error);
  }

  switch (err.response?.status) {
    case 400:
      console.error("Bad Request");
      break;
    case 401:
      // unauthorized
      onLogout();
      break;
    case 404:
      console.error("Resource Not Found");
      break;
    case 419:
      originalRequest._retry = true;

      // handle token/session expired
      const new_token = await handleRefreshToken();

      originalRequest.headers.Authorization = `Bearer ${new_token}`;

      return api(originalRequest);
      break;
    case 500:
      console.error("Internal Server Error");
      break;
    default:
      break;
  }

  return Promise.reject(error);
});

const handleRefreshToken = async () => {
  const auth = useAuthStore.getState();

  const response = await refreshToken(auth.token?.refresh_token as string)

  auth.setToken({
    access_token: response?.access_token,
    refresh_token: response?.refresh_token,
  })

  return response?.access_token
};

const onLogout = () => {
  const auth = useAuthStore.getState();

  auth.setToken(null);
  auth.setUser(null);

  window.location.href = "/login";
}

export { api, onLogout };

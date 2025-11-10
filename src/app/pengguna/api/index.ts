import { api } from "@/api/axios"

/* types */
import type { TypeUserStore } from "../stores";
import type { IPagination } from "@/types/base";
import type { DetailResponse, FormPayload, ListResponse, RolesResponse } from "../types";

export const getUsers = async (params: TypeUserStore['filters']) => {
  const response = await api.get('/users', { params });

  return response.data as IPagination<ListResponse>;
}

export const getUserDetail = async (id: number) => {
  const response = await api.get(`/users/${id}`);

  return response.data as DetailResponse;
}

export const createUser = async (payload: FormPayload) => {
  const new_payload = {
    ...payload,
    roleID: Number(payload.roleID),
    branchID: Number(payload.branchID)
  }

  const response = await api.post('/users', new_payload);

  return response.data;
}

export const editUser = async (id: number, payload: FormPayload) => {
  const { password, ...rest } = payload

  const new_payload = {
    ...rest,
    roleID: Number(payload.roleID),
    branchID: Number(payload.branchID)
  }

  const response = await api.put(`/users/${id}`, new_payload);

  return response.data;
}

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);

  return response.data as DetailResponse;
}

export const getUserRoles = async () => {
  const response = await api.get("/roles");

  return response.data as IPagination<RolesResponse[]>;
}

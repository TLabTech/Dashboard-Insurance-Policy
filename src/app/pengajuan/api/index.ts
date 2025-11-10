import { api } from "@/api/axios"
import type { IPagination } from "@/types/base";
import type { DetailResponse, FormPayload, ListResponse, SummaryType } from "../types";
import type { TypeSubmissionStore } from "../stores";

export const getSubmission = async (params: TypeSubmissionStore['filters']) => {
  const response = await api.get('/submission', { params });

  return response.data as IPagination<ListResponse>;
}

export const getSubmissionSummary = async () => {
  const response = await api.get('/submission/summary');

  return response.data as SummaryType;
}

export const getSubmissionDetail = async (id: number) => {
  const response = await api.get(`/submission/${id}`);

  return response.data as DetailResponse;
}

export const getSubmissionDocument = async (id: number) => {
  const response = await api.get(`/submission/${id}/stream`, {
    responseType: 'arraybuffer',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });

  const contentType = response.headers['content-type'] || 'application/pdf'
  const blob = new Blob([response.data], { type: contentType })
  const blobURL = URL.createObjectURL(blob)

  return { blobURL, contentType };
}

export const createSubmission = async (payload: FormPayload) => {
  const response = await api.post('/submission', payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export const editSubmission = async (id: number, payload: FormPayload) => {
  const response = await api.put(`/submission/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export const deleteSubmission = async (id: number) => {
  const response = await api.delete(`/submission/${id}`);

  return response.data;
}

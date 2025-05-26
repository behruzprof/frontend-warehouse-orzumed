// drug-request/api.ts
import { clientApi } from '@/shared/api';
import type {
  CreateDrugRequest,
  DrugRequest,
  UpdateDrugRequest
} from '../types/drug-request';

export const getDrugRequestList = async () => {
  const response = await clientApi.get<DrugRequest[]>('/drug-requests');
  return response.data;
};

export const getDrugRequestById = async (id: number) => {
  const response = await clientApi.get<DrugRequest>(`/drug-requests/${id}`);
  return response.data;
};

export const createDrugRequest = async (data: CreateDrugRequest) => {
  const response = await clientApi.post('/drug-requests', data);
  return response.data;
};

export const updateDrugRequest = async (id: number, data: UpdateDrugRequest) => {
  const response = await clientApi.patch(`/drug-requests/${id}`, data);
  return response.data;
};

export const deleteDrugRequest = async (id: number) => {
  const response = await clientApi.delete(`/drug-requests/${id}`);
  return response.data;
};

// reports
export const getReportByDepartment = async () => {
  const response = await clientApi.get('/drug-requests/report/by-department');
  return response.data;
};

export const getReportByDrugId = async (drugId: number) => {
  const response = await clientApi.get(`/drug-requests/report/by-drug/${drugId}`);
  return response.data;
};

export const getReportByPatient = async () => {
  const response = await clientApi.get('/drug-requests/report/by-patient');
  return response.data;
};

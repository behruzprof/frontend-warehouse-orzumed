// drug-request/queries.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createDrugRequest,
  deleteDrugRequest,
  getDrugRequestById,
  getDrugRequestList,
  getReportByDepartment,
  getReportByDrugId,
  getReportByPatient,
  updateDrugRequest
} from './api';
import type { UpdateDrugRequest, CreateDrugRequest } from '../types/drug-request';

export const useDrugRequestList = () => {
  return useQuery({
    queryKey: ['drug-requests'],
    queryFn: getDrugRequestList
  });
};

export const useDrugRequestById = (id: number) => {
  return useQuery({
    queryKey: ['drug-requests', id],
    queryFn: () => getDrugRequestById(id)
  });
};

export const useCreateDrugRequest = () => {
  return useMutation({
    mutationKey: ['drug-requests'],
    mutationFn: (data: CreateDrugRequest[]) => createDrugRequest(data)
  });
};

export const useUpdateDrugRequest = (id: number) => {
  return useMutation({
    mutationKey: ['drug-requests', id],
    mutationFn: (data: UpdateDrugRequest) => updateDrugRequest(id, data)
  });
};

export const useDeleteDrugRequest = (id: number) => {
  return useMutation({
    mutationKey: ['drug-requests', id],
    mutationFn: () => deleteDrugRequest(id)
  });
};

// Reports
export const useReportByDepartment = () => {
  return useQuery({
    queryKey: ['drug-requests', 'report', 'by-department'],
    queryFn: getReportByDepartment
  });
};

export const useReportByDrugId = (drugId: number) => {
  return useQuery({
    queryKey: ['drug-requests', 'report', 'by-drug', drugId],
    queryFn: () => getReportByDrugId(drugId),
    enabled: !!drugId, // чтобы не выполнялся, если drugId пустой
  });
};

export const useReportByPatient = () => {
  return useQuery({
    queryKey: ['drug-requests', 'report', 'by-patient'],
    queryFn: getReportByPatient
  });
};

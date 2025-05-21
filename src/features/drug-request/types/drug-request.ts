import type { Drug } from "@/features/drug/types/drug";

/** Используем enum вместо строковых литералов */
export enum DrugRequestStatus {
  ISSUED = 'issued',
  RETURNED = 'returned',
}

export interface CreateDrugRequest {
  departmentId: number;
  drugId: number;
  patientName?: string;
  quantity: number;
  status: DrugRequestStatus;
}

export interface UpdateDrugRequest {
  departmentId?: number;
  drugId?: number;
  patientName?: string;
  quantity?: number;
  status?: DrugRequestStatus;
}

export interface DrugRequest {
  id: number;
  department: any;
  drug: Drug;
  patientName?: string;
  quantity: number;
  status: DrugRequestStatus;
  createdAt: string;
  updatedAt: string;
}

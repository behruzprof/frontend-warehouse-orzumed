import type { Drug } from "@/features/drug/types/drug";



export interface CreateDrugRequest {
  departmentId: number;
  drugId: number;
  quantity: number;
}

export interface UpdateDrugRequest {
  departmentId?: number;
  drugId?: number;
  quantity?: number;
}

export interface DrugRequest {
  id: number;
  department: any;
  drug: Drug;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

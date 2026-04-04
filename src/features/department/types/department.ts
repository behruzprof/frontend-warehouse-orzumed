import type { DrugRequest } from "@/features/drug-request/types/drug-request"

export interface Department {
  id: number
  name: string
  drugRequests: DrugRequest[]
}

export interface CreateDepartment {
  name: string
}

export interface UpdateDepartment {
  name: string
}

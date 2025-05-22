import { clientApi } from '@/shared/api'
import type { CreateDepartment, Department, UpdateDepartment } from '../types/department'

export const getDepartmentList = async () => {
  const response = await clientApi.get<Department[]>('/departments')
  return response.data
}

export const getDepartmentById = async (id: number) => {
  const response = await clientApi.get<Department>(`/departments/${id}`)
  return response.data
}

export const createDepartment = async (data: CreateDepartment) => {
  const response = await clientApi.post('/departments', data)
  return response.data
}

export const updateDepartment = async (id: number, data: UpdateDepartment) => {
  const response = await clientApi.patch(`/departments/${id}`, data)
  return response.data
}

export const deleteDepartment = async (id: number) => {
  const response = await clientApi.delete(`/departments/${id}`)
  return response.data
}

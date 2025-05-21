
import { clientApi } from '@/shared/api'
import type { CreateDrug, Drug, UpdateDrug } from '../types/drug'

export const getDrugList = async () => {
  const response = await clientApi.get<Drug[]>('/drugs')
  return response.data
}
export const getDrugById = async (id: string) => {
  const response = await clientApi.get<Drug>(`/drugs/${id}`)
  return response.data
}
export const createDrug = async (data: CreateDrug) => {
  const response = await clientApi.post('/drugs', data)
  return response.data
}
export const updateDrug = async (id: string, data: UpdateDrug) => {
  const response = await clientApi.patch(`/drugs/${id}`, data)
  return response.data
}
export const deleteDrug = async (id: string) => {
  const response = await clientApi.delete(`/drugs/${id}`)
  return response.data
}
export const getDrugListByName = async (name: string) => {
  const response = await clientApi.get<Drug[]>(`/drugs/search?query=${name}`)
  return response.data
}
export const getDrugListByNameAndGetAll = async (name: string) => {
  const response = await clientApi.get<Drug[]>(`/drugs/search/all?query=${name}`)
  return response.data
}
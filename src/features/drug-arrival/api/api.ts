import { clientApi } from '@/shared/api'
import type { CreateDrugArrivalDto, DrugArrival, UpdateDrugArrivalDto } from '../types/drug-arrival'

export const getDrugArrivals = async () => {
  const response = await clientApi.get<DrugArrival[]>('/drug-arrivals')
  return response.data
}

export const getDrugArrivalById = async (id: number) => {
  const response = await clientApi.get<DrugArrival>(`/drug-arrivals/${id}`)
  return response.data
}

export const createDrugArrival = async (data: CreateDrugArrivalDto) => {
  const response = await clientApi.post('/drug-arrivals', data)
  return response.data
}

export const updateDrugArrival = async (id: number, data: UpdateDrugArrivalDto) => {
  const response = await clientApi.patch(`/drug-arrivals/${id}`, data)
  return response.data
}

export const deleteDrugArrival = async (id: number) => {
  const response = await clientApi.delete(`/drug-arrivals/${id}`)
  return response.data
}

export const getDrugArrivalsByPeriod = async (start: string, end: string) => {
  const response = await clientApi.get<DrugArrival[]>(`/drug-arrivals/report/by-period`, {
    params: { start, end },
  })
  return response.data
}

export const getDrugArrivalsReportByRange = async (start: string, end: string) => {
  const response = await clientApi.get(`/drug-arrivals/report/range`, {
    params: { start, end },
  })
  return response.data
}

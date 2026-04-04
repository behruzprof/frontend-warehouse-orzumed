
import { clientApi } from '@/shared/api'
import type { CreateDrugOrderDto } from '../types/drug-order'


export const createDrugDrug = async (data: CreateDrugOrderDto[]) => {
  const response = await clientApi.post('/drug-order', data)
  return response.data
}
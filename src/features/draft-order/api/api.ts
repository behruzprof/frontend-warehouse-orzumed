import { clientApi } from '@/shared/api'
import type { CreateDraftOrderDto } from '../types/drug-order'

// Создание черновика
export const createDraftOrder = async (data: CreateDraftOrderDto) => {
  const response = await clientApi.post('/draft-order', data)
  return response.data
}

// Получение всех черновиков
export const getAllDraftOrders = async () => {
  const response = await clientApi.get('/draft-order')
  return response.data
}

// Удаление одного черновика по ID
export const deleteDraftOrderById = async (id: number) => {
  const response = await clientApi.delete(`/draft-order/${id}`)
  return response.data
}

// Удаление всех черновиков
export const deleteAllDraftOrders = async () => {
  const response = await clientApi.delete('/draft-order')
  return response.data
}

// Синхронизация черновиков в реальные заказы
export const syncDraftOrdersToDrugOrder = async () => {
  const response = await clientApi.post('/draft-order/sync-to-drug-order')
  return response.data
}

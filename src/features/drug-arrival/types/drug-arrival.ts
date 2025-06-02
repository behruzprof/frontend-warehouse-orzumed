import type { Drug } from '@/features/drug/types/drug'

export interface DrugArrival {
  id: number
  drug: Drug
  quantity: number
  purchaseAmount: number
  arrivalDate: string // ISO-строка
  expiryDate: string // ISO-строка
  supplier: string
  paymentType: string
}

export interface UpdateDrugArrivalDto extends Partial<DrugArrival> {}

export interface CreateDrugArrivalDto {
  drugId: number
  quantity: number
  purchaseAmount: number
  arrivalDate: string
  expiryDate: string
  supplier: string
  paymentType: string
}

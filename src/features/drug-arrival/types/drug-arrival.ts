import type { Drug } from '@/features/drug/types/drug'

export interface DrugArrival {
  id: number
  drug: Drug
  piece?: number
  costPerPiece?: number
  
  quantity: number
  purchaseAmount: number
  arrivalDate: string // ISO-строка
  expiryDate: string // ISO-строка
  supplier: string
  paymentType: string
}

export interface UpdateDrugArrivalDto extends Partial<CreateDrugArrivalDto> {}

export interface CreateDrugArrivalDto {
  drugId: number | string 
  piece: number          // Количество прихода (упаковок/штук)
  costPerPiece: number   // Цена за единицу
  
  quantity: number
  purchaseAmount: number // Оставляем, так как фронтенд его вычисляет и передает
  arrivalDate: string
  expiryDate: string
  supplier: string
  paymentType: string
}
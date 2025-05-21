export interface CreateDrug {
  name: string
  unit: string
  description?: string
  photo?: string
  shelf: string
  section: string
  row: number
  quantity: number
  supplier: string
  purchaseAmount: number
  arrivalDate: string
  expiryDate: string
  orderQuantity: number
}

export interface UpdateDrug {
  name?: string
  unit?: string
  description?: string
  photo?: string
  shelf?: string
  section?: string
  row?: number
  quantity?: number
  orderQuantity?: number
  supplier?: string
  purchaseAmount?: number
  arrivalDate?: string
  expiryDate?: string
}

export interface Drug {
  id: string
  name: string
  unit: string
  description?: string
  photo?: string
  shelf: string
  section: string
  row: number
  quantity: number
  orderQuantity: number
  supplier: string
  purchaseAmount: number
  arrivalDate: string
  expiryDate: string
}

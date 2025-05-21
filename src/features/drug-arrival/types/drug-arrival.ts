export interface CreateDrugArrivalDto {
  drugId: number
  quantity: number
  purchaseAmount: number
  arrivalDate: string
  expiryDate: string
  supplier: string
}

export interface UpdateDrugArrivalDto extends Partial<CreateDrugArrivalDto> {}

export interface DrugArrival {
  id: number
  drug: {
    id: number
    name: string
    unit: string
    shelf: string
    section: string
    row: number
    quantity: number
    orderQuantity: number
    supplier: string
    purchaseAmount: number
    arrivalDate: string
    expiryDate: string
    description?: string
    photo?: string
  }
  quantity: number
  purchaseAmount: number
  arrivalDate: string
  expiryDate: string
  supplier: string
}

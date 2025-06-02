export interface CreateDrugDto {
  name: string // Название лекарства (обязательно)
  quantity: number // Количество в наличии (обязательно)
  minStock: number // Минимальный запас (обязательно)
  maxStock: number // Максимальный запас (обязательно)
  supplier: string // Название поставщика (обязательно)
  purchaseAmount: number // Сумма закупки (обязательно)
  expiryDate: string // Срок годности (обязательно)
  shelf?: string // Номер шкафа
  section?: string // Секция/полка
  row?: number // Ряд (индекс)
  category?: string // Категория (например, "антибиотик")
  arrivalDate?: string // Дата последнего прихода
  paymentType: string
}

export interface UpdateDrug extends Partial<CreateDrugDto> {}

export interface Drug {
  id: number
  name: string
  quantity: number
  minStock: number
  maxStock: number
  supplier: string
  purchaseAmount: number
  expiryDate: string // ISO-строка
  shelf?: string | null
  section?: string | null
  row?: number | null
  category: string
  manufacturer?: string | null
  arrivalDate: string // ISO-строка
}

export interface CreateDrugDto {
  name: string; // Название лекарства (обязательно)
  quantity: number; // Общее количество (обязательно)
  unit: string; // Единица измерения: 'ml', 'g', 'pcs'
  minStock: number; // Минимальный запас (обязательно)
  maxStock: number; // Максимальный запас (обязательно)
  supplier: string; // Название поставщика (обязательно)
  
  // 🆕 НОВЫЕ ПОЛЯ
  IsStandard: boolean; // Добавлять ли в сделку по умолчанию
  piece: number; // Количество прихода (штук/упаковок)
  costPerPiece: number; // Цена за единицу
  // ❌ purchaseAmount УДАЛЕН (вычисляется на сервере: piece * costPerPiece)

  expiryDate: string; // Срок годности (обязательно)
  shelf?: string; // Номер шкафа
  section?: string; // Секция/полка
  row?: number; // Ряд (индекс)
  category?: string; // Категория (например, "антибиотик")
  arrivalDate?: string; // Дата последнего прихода
  paymentType: string;
}

export interface UpdateDrug extends Partial<CreateDrugDto> {}

export interface Drug {
  id: number | string; // 🔄 number для реальной базы, string для UUID шаблонов
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  supplier: string;
  
  // 🆕 НОВЫЕ ПОЛЯ
  IsStandard: boolean;
  piece: number;
  costPerPiece: number;
  
  // ✅ ОСТАВЛЕНО: Бэкенд возвращает уже готовую вычисленную сумму
  purchaseAmount: number; 

  expiryDate: string; // ISO-строка
  shelf?: string | null;
  section?: string | null;
  row?: number | null;
  category: string;
  manufacturer?: string | null;
  arrivalDate: string; // ISO-строка
}
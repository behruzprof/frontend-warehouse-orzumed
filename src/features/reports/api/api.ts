import { clientApi } from '@/shared/api'
import type {
  ArrivalsReportByPeriodResponse,
  ArrivalsByDrugResponse,
  DailyStatsResponse,
  ExpiringSoonResponse,
  PaymentStats,
  SumAndCountByPaymentTypeResponse,
  SumBySupplierResponse
} from '../types/drug-report'

// Получить приходы за период
export const getArrivalsByPeriod = async (start: string, end: string): Promise<ArrivalsReportByPeriodResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/by-period?start=${start}&end=${end}`)
  return response.data
}

// Отчёт прихода за период (range)
export const getArrivalsReportByRange = async (start: string, end: string): Promise<ArrivalsReportByPeriodResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/range?start=${start}&end=${end}`)
  return response.data
}

// Сумма по типам оплаты за период
export const getSumByPaymentType = async (start: string, end: string): Promise<SumBySupplierResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/sum-by-payment-type?start=${start}&end=${end}`)
  return response.data
}

// Детализированный отчёт по типам оплаты
export const getDetailedReportByPaymentType = async (start: string, end: string): Promise<PaymentStats[]> => {
  const response = await clientApi.get(`/drug-arrivals/report/detailed-by-payment-type?start=${start}&end=${end}`)
  return response.data
}

// Детализированный отчёт по приходам
export const getDetailedArrivalsReport = async (start: string, end: string): Promise<ArrivalsByDrugResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/detailed-arrivals?start=${start}&end=${end}`)
  return response.data
}

// Приходы, которые скоро истекают, сгруппированные по типу оплаты
export const getExpiringSoonGroupedByPaymentType = async (daysAhead: number): Promise<ExpiringSoonResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/expiring-soon-by-payment-type?daysAhead=${daysAhead}`)
  return response.data
}

// Приходы за период по конкретному типу оплаты
export const getArrivalsByPaymentType = async (
  paymentType: string,
  start: string,
  end: string
): Promise<ArrivalsByDrugResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/by-payment-type?paymentType=${paymentType}&start=${start}&end=${end}`)
  return response.data
}

// Сумма и количество по типам оплаты
export const getSumAndCountByPaymentType = async (
  start: string,
  end: string
): Promise<SumAndCountByPaymentTypeResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/sum-and-count-by-payment-type?start=${start}&end=${end}`)
  return response.data
}

// Приходы по конкретному препарату
export const getArrivalsByDrug = async (drugId: number): Promise<ArrivalsByDrugResponse> => {
  const response = await clientApi.get(`/drug-arrivals/by-drug/${drugId}`)
  return response.data
}

// Ежедневная статистика приходов за период
export const getDailyStats = async (start: string, end: string): Promise<DailyStatsResponse> => {
  const response = await clientApi.get(`/drug-arrivals/report/daily-stats?start=${start}&end=${end}`)
  return response.data
}
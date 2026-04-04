import { useQuery } from '@tanstack/react-query'
import {
  getArrivalsByDrug,
  getArrivalsByPaymentType,
  getArrivalsReportByRange,
  getDetailedArrivalsReport,
  getDetailedReportByPaymentType,
  getExpiringSoonGroupedByPaymentType,
  getSumAndCountByPaymentType,
  getSumByPaymentType
} from './api'

// Приходы за период по препарату
export const useArrivalsByDrug = (drugId: number) =>
  useQuery({
    queryKey: ['arrivals-by-drug', drugId],
    queryFn: () => getArrivalsByDrug(drugId),
    enabled: !!drugId,
  })

// Приходы по типу оплаты
export const useArrivalsByPaymentType = (paymentType: string, start: string, end: string) =>
  useQuery({
    queryKey: ['arrivals-by-payment-type', paymentType, start, end],
    queryFn: () => getArrivalsByPaymentType(paymentType, start, end),
    enabled: !!paymentType && !!start && !!end,
  })

// Отчёт по диапазону
export const useArrivalsReportByRange = (start: string, end: string) =>
  useQuery({
    queryKey: ['arrivals-report-range', start, end],
    queryFn: () => getArrivalsReportByRange(start, end),
    enabled: !!start && !!end,
  })

// Детализированный отчёт по типам оплаты
export const useDetailedReportByPaymentType = (start: string, end: string) =>
  useQuery({
    queryKey: ['detailed-report-by-payment-type', start, end],
    queryFn: () => getDetailedReportByPaymentType(start, end),
    enabled: !!start && !!end,
  })

// Детализированный отчёт по приходам
export const useDetailedArrivalsReport = (start: string, end: string) =>
  useQuery({
    queryKey: ['detailed-arrivals-report', start, end],
    queryFn: () => getDetailedArrivalsReport(start, end),
    enabled: !!start && !!end,
  })

// Истекающие скоро препараты (по типам оплаты)
export const useExpiringSoonGroupedByPaymentType = (daysAhead: number) =>
  useQuery({
    queryKey: ['expiring-soon-by-payment-type', daysAhead],
    queryFn: () => getExpiringSoonGroupedByPaymentType(daysAhead),
    enabled: daysAhead > 0,
  })

// Сумма по типам оплаты
export const useSumByPaymentType = (start: string, end: string) =>
  useQuery({
    queryKey: ['sum-by-payment-type', start, end],
    queryFn: () => getSumByPaymentType(start, end),
    enabled: !!start && !!end,
  })

// Сумма и количество по типам оплаты
export const useSumAndCountByPaymentType = (start: string, end: string) =>
  useQuery({
    queryKey: ['sum-and-count-by-payment-type', start, end],
    queryFn: () => getSumAndCountByPaymentType(start, end),
    enabled: !!start && !!end,
  })

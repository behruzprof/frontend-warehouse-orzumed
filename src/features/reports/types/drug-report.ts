import type { DrugArrival } from "@/features/drug-arrival/types/drug-arrival";

export interface SupplierSum {
  supplier: string;
  totalAmount: number;
}
export type SumBySupplierResponse = SupplierSum[];

export type ExpiringSoonResponse = DrugArrival[];

export interface SupplierReport {
  name: string;
  totalAmount: number;
  totalQuantity: number;
}

export interface StockByDrug {
  drugName: string;
  quantity: number;
}

export interface ArrivalsReportByPeriodResponse {
  totalQuantity: number;
  totalAmount: number;
  averagePurchasePrice: number;
  batchCount: number;
  arrivals: DrugArrival[];
  suppliers: SupplierReport[];
  stockByDrug: StockByDrug[];
}

export type ArrivalsByDrugResponse = DrugArrival[];

export interface DailyStat {
  date: string; // 'YYYY-MM-DD'
  quantity: number;
}
export type DailyStatsResponse = DailyStat[];

export interface PaymentStats {
  paymentType: string;
  totalAmount: number;
  totalQuantity: number;
  batchCount: number;
}
export type SumAndCountByPaymentTypeResponse = PaymentStats[];


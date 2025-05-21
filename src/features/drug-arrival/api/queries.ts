import { useQuery, useMutation } from '@tanstack/react-query'
import {
  createDrugArrival,
  deleteDrugArrival,
  getDrugArrivalById,
  getDrugArrivals,
  getDrugArrivalsByPeriod,
  getDrugArrivalsReportByRange,
  updateDrugArrival,
} from './api'
import type { UpdateDrugArrivalDto } from '../types/drug-arrival'

export const useDrugArrivals = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drug-arrivals'],
    queryFn: getDrugArrivals,
  })
  return { data, error, isLoading }
}

export const useDrugArrivalById = (id: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drug-arrivals', id],
    queryFn: () => getDrugArrivalById(id),
  })
  return { data, error, isLoading }
}

export const useCreateDrugArrival = () => {
  return useMutation({
    mutationKey: ['drug-arrivals'],
    mutationFn: createDrugArrival,
  })
}

export const useUpdateDrugArrival = (id: number) => {
  return useMutation({
    mutationKey: ['drug-arrivals'],
    mutationFn: (data: UpdateDrugArrivalDto) => updateDrugArrival(id, data),
  })
}

export const useDeleteDrugArrival = (id: number) => {
  return useMutation({
    mutationKey: ['drug-arrivals'],
    mutationFn: () => deleteDrugArrival(id),
  })
}

export const useDrugArrivalsByPeriod = (start: string, end: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drug-arrivals', 'period', start, end],
    queryFn: () => getDrugArrivalsByPeriod(start, end),
    enabled: !!start && !!end,
  })
  return { data, error, isLoading }
}

export const useDrugArrivalsReportByRange = (start: string, end: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drug-arrivals', 'report-range', start, end],
    queryFn: () => getDrugArrivalsReportByRange(start, end),
    enabled: !!start && !!end,
  })
  return { data, error, isLoading }
}

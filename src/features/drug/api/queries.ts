import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createDrug,
  deleteDrug,
  getDrugById,
  getDrugList,
  getDrugListByName,
  getDrugListByNameAndGetAll,
  updateDrug
} from './api'
import type { UpdateDrug } from '../types/drug'

export const useDrugList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drugs'],
    queryFn: getDrugList
  })
  return { data, error, isLoading }
}
export const useDrugById = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drugs', id],
    queryFn: () => getDrugById(id)
  })
  return { data, error, isLoading }
}
export const useCreateDrug = () => {
  return useMutation({
    mutationKey: ['drugs'],
    mutationFn: createDrug
  })
}
export const useUpdateDrug = (id: string) => {
  return useMutation({
    mutationKey: ['drugs'],
    mutationFn: (data: UpdateDrug) => updateDrug(id, data)
  })
}
export const useDeleteDrug = (id: string) => {
  return useMutation({
    mutationKey: ['drugs'],
    mutationFn: () => deleteDrug(id)
  })
}
export const useDrugListByName = (name: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drugs', name],
    queryFn: () => getDrugListByName(name)
  })
  return { data, error, isLoading }
}
export const useDrugListByNameAndGetAll = (name: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['drugs', name],
    queryFn: () => getDrugListByNameAndGetAll(name)
  })
  return { data, error, isLoading }
}

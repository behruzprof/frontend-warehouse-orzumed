import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartmentList,
  updateDepartment
} from './api'
import type { UpdateDepartment } from '../types/department'

export const useDepartmentList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartmentList
  })
  return { data, error, isLoading }
}

export const useDepartmentById = (id: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['departments', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id
  })
  return { data, error, isLoading }
}

export const useCreateDepartment = () => {
  return useMutation({
    mutationKey: ['departments'],
    mutationFn: createDepartment
  })
}

export const useUpdateDepartment = (id: number) => {
  return useMutation({
    mutationKey: ['departments'],
    mutationFn: (data: UpdateDepartment) => updateDepartment(id, data)
  })
}

export const useDeleteDepartment = (id: number) => {
  return useMutation({
    mutationKey: ['departments'],
    mutationFn: () => deleteDepartment(id)
  })
}
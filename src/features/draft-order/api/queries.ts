import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDraftOrder,
  getAllDraftOrders,
  deleteDraftOrderById,
  deleteAllDraftOrders,
  syncDraftOrdersToDrugOrder,
} from './api'

// Хук для создания черновика
export const useCreateDraftOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['draft-order', 'create'],
    mutationFn: createDraftOrder,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['draft-order', 'all'] });
    },
  });
}
// Хук для получения всех черновиков
export const useGetAllDraftOrders = () => {
  return useQuery({
    queryKey: ['draft-order', 'all'],
    queryFn: getAllDraftOrders,
  })
}

// Хук для удаления одного черновика
export const useDeleteDraftOrderById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['draft-order', 'delete-one'],
    mutationFn: (id: number) => deleteDraftOrderById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft-order', 'all'] });
    },
  });
};

// Хук для удаления всех черновиков
export const useDeleteAllDraftOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['draft-order', 'delete-all'],
    mutationFn: deleteAllDraftOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft-order', 'all'] });
    },
  });
};


export const useSyncDraftOrders = () => {
  return useMutation({
    mutationKey: ['sync-to-drug-order'],
    mutationFn: syncDraftOrdersToDrugOrder,
  });
}

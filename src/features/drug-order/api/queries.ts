import { useMutation } from '@tanstack/react-query'
import {
  createDrugDrug
} from './api'


export const useCreateDrugOrder = () => {
  return useMutation({
    mutationKey: ['drugs-order'],
    mutationFn: createDrugDrug,
    onSuccess() {
      
    },
  })
}

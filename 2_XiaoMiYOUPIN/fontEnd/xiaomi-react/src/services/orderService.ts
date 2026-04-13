import { useMutation } from '@tanstack/react-query';
import { getAddressList, submitOrder } from '@/api';
import type { Address, ServiceOptions } from '@/types';
import { updateCart } from './cartService';

export const useAddressList = () => {
  return useMutation({
    mutationFn: async (): Promise<Address[]> => getAddressList(),
  });
};

export const useConfirmOrder = (options?: ServiceOptions) => {
  return useMutation({
    mutationFn: async (data: { ids: number[]; account: number; addressId: number }) => {
      const { ids, account, addressId } = data;
      return await submitOrder(ids, account, addressId);
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useUpdateCart = () => {
  return useMutation({
    mutationFn: async () => {
      return await updateCart();
    },
  });
};

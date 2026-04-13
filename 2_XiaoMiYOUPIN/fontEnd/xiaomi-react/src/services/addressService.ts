import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAddress,
  deleteAddress,
  getAddressList,
  getTargetAddress,
  setDefaultAddress,
  updateAddress,
} from '@/api';
import type { Address, ServiceOptions } from '@/types';

export const useAllAddress = () => {
  return useQuery({
    queryKey: ['allAddress'],
    queryFn: async () => {
      return await getAddressList();
    },
  });
};

export const useAddressManager = (options?: ServiceOptions) => {
  const queryClient = useQueryClient();

  const targetAddressMutation = useMutation({
    mutationFn: async (addressId: number): Promise<Address> => {
      return await getTargetAddress(addressId);
    },
  });

  // 装饰过的success/error回调，适用于重新拉取数据的mutation
  const decoratedReactFunc = {
    onSuccess: () => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
      // 令allAddress查询失效、重新拉取
      queryClient.invalidateQueries({ queryKey: ['allAddress'] });
    },
    onError: options?.onError,
  };

  // 以下mutation需要重新拉取列表数据
  const addAddrssMutation = useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      const newId = await addAddress(address);
      if (address.isDefault) {
        await setDefaultAddress(newId);
      }
    },
    ...decoratedReactFunc,
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (address: Address) => {
      await updateAddress(address);
      if (address.isDefault) {
        await setDefaultAddress(address.id);
      }
    },
    ...decoratedReactFunc,
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: number) => {
      return await deleteAddress(addressId);
    },
    ...decoratedReactFunc,
  });

  return {
    // mutateAync返回promise，mutate在useMutation onSuccess/OnError回调处理结果
    getTargetAddress: targetAddressMutation.mutateAsync,
    addAddress: addAddrssMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    deleteAddress: deleteAddressMutation.mutateAsync,
  };
};

import { useMutation } from '@tanstack/react-query';
import {
  addCart,
  decreaseProductInCart,
  deleteCart,
  getCartProductList,
  increaseProductInCart,
} from '@/api';
import { getGlobalStore } from '@/store';
import type { ServiceOptions } from '@/types';

export const updateCart = async () => {
  const json = await getCartProductList();
  const { setCartList } = getGlobalStore();
  setCartList(json);
};

export const useAddCart = (pid: number, count: number, options?: ServiceOptions) => {
  return useMutation({
    mutationFn: async () => {
      return await addCart(pid, count);
    },
    onSuccess: () => {
      updateCart();
      if (typeof options?.onSuccess === 'function') {
        options.onSuccess();
      }
    },
    onError: options?.onError,
  });
};

export const useDeleteCart = (options?: ServiceOptions) => {
  return useMutation({
    mutationFn: async (cids: number[]) => {
      return await deleteCart(cids);
    },
    onSuccess: () => {
      updateCart();
      if (typeof options?.onSuccess === 'function') {
        options.onSuccess();
      }
    },
    onError: options?.onError,
  });
};

export const useDecreaseProduct = (cid: number, options?: ServiceOptions) => {
  return useMutation({
    mutationFn: async () => {
      return await decreaseProductInCart(cid);
    },
    onSuccess: () => {
      updateCart();
      if (typeof options?.onSuccess === 'function') {
        options.onSuccess();
      }
    },
    onError: options?.onError,
  });
};

export const useIncreaseProduct = (cid: number, options?: ServiceOptions) => {
  return useMutation({
    mutationFn: async () => {
      return await increaseProductInCart(cid);
    },
    onSuccess: () => {
      updateCart();
      if (typeof options?.onSuccess === 'function') {
        options.onSuccess();
      }
    },
    onError: options?.onError,
  });
};

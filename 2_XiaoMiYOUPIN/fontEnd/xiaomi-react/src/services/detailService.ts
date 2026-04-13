import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { addCart, getCartProductList, getDefaultAddress, getProduct, submitOrder } from '@/api';
import { useGlobalStore } from '@/store';
import type { Address, CartItem, Product, ServiceOptions } from '@/types';

export const useProduct = (pid: number): UseQueryResult<Product> => {
  return useQuery({
    queryKey: ['product', pid],
    queryFn: async (): Promise<Product> => {
      return await getProduct(pid);
    },
  });
};

export const useDefaultAddress = (): { data: Address | undefined } => {
  const initialData = {
    id: 0,
    name: '',
    receiveName: '',
    receivePhone: '',
    receiveRegion: '北京 北京市 海淀区 清河街道',
    receiveDetail: '',
    isDefault: true,
  };

  const { userName, isLogin } = useGlobalStore(
    useShallow(state => ({ userName: state.userName, isLogin: state.isLogin }))
  );
  const { data: address } = useQuery({
    queryKey: ['defaultAddress', userName],
    queryFn: async (): Promise<Address> => {
      return await getDefaultAddress();
    },
    enabled: isLogin,
  });
  const displayAddress = isLogin ? address : initialData;
  return { data: displayAddress };
};

/**
 * 立即购买：添加商品到购物车-获取所有购物车记录找到指定记录及id-确认订单
 * ps：本流程受制于旧服务器，暂时如此实现
 */
export const useBuyImmediately = (options?: ServiceOptions) => {
  return useMutation({
    mutationFn: async ({
      pid,
      count,
      total,
      addressId,
    }: {
      pid: number;
      count: number;
      total: number;
      addressId: number;
    }) => {
      await addCart(pid, count);
      const cartItems: CartItem[] = await getCartProductList();
      const cartId: number | undefined = cartItems.find(item => item.pid === pid)?.id;
      if (!cartId) {
        throw new Error('未找到指定商品');
      }
      await submitOrder([cartId], total, addressId);
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

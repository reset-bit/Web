import { getCategory, getDefaultAddress } from '@/api';
import { getGlobalStore } from '@/store';
import type { Address, CartItem, Category } from '@/types';

// 全局loader，加载购物车状态
export const globalLoader = async (): Promise<CartItem[]> => {
  const cartList = getGlobalStore().cartList;
  return Promise.resolve(cartList);
};

// 分类页loader，加载一级分类
export const categoryLoader = async (): Promise<{ key: string; label: string }[]> => {
  const json = await getCategory(0);
  return json.map((item: Category) => {
    return {
      key: String(item.id),
      label: item.name,
    };
  });
};

// 订单页loader，加载默认收货地址
export const orderLoader = async (): Promise<Address> => {
  return await getDefaultAddress();
};

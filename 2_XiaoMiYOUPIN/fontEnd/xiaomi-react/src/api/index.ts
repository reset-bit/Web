import { getCookie } from 'typescript-cookie';
import type { Address, CartItem, Category, ListOrderCol, ListOrderDir, Product } from '@/types';
import { fetchInstance } from './fetchInstance';

// #region category

/**
 * 获取指定分类ID的目录内容
 * @param categoryId - 分类ID
 * @returns 返回分类信息数组
 */
export const getCategory = async (categoryId: number): Promise<Category[]> => {
  return await fetchInstance({ baseUrl: `category/list/${categoryId}` });
};

// #endregion

// #region product

/**
 * 获取指定商品ID的商品详情
 * @param productId - 商品ID
 * @returns 返回商品详情信息对象
 */
export const getProduct = async (productId: number): Promise<Product> => {
  return await fetchInstance({ baseUrl: `product/model/${productId}` });
};

/**
 * 商品列表查询参数接口
 * 用于分页查询商品列表时的参数配置
 */
export interface ProductListProps {
  /**
   * 商品名称，用于模糊查询
   */
  name: '';
  /**
   * 分类ID，用于筛选指定分类下的商品
   */
  cid: number;
  /**
   * 排序列，可选值为'price'(价格)、'sale'(销量)、'rate'(评分)
   */
  orderCol: ListOrderCol;
  /**
   * 排序方向，可选值为'asc'(升序)、'desc'(降序)
   */
  orderDir: ListOrderDir;
  /**
   * 起始位置，用于分页查询
   */
  begin: number;
  /**
   * 每页数量，用于分页查询
   */
  pageSize: number;
}

/**
 * 分页查询商品列表
 * @param props - 商品列表查询参数
 * @returns 返回商品列表数据数组
 */
export const getProductList = async (props: ProductListProps): Promise<Product[]> => {
  return await fetchInstance({ baseUrl: `product/list`, data: props, method: 'POST' });
};

// #endregion

// #region user
/**
 * 用户注册
 * @param name - 用户名
 * @param pwd - 密码
 * @param phone - 手机号
 * @returns 返回注册结果，包含用户信息和token
 */
export const register = async (name: string, pwd: string, phone: string) => {
  return await fetchInstance({
    baseUrl: 'user/register',
    data: { name, pwd, phone },
    method: 'POST',
  });
};

/**
 * 用户登录
 * @param name - 用户名
 * @param pwd - 密码
 * @returns 返回登录结果，包含用户信息和token
 */
export const login = async (name: string, pwd: string) => {
  return await fetchInstance({
    baseUrl: 'user/login_pwd',
    data: { name, pwd },
    method: 'POST',
  });
};

// #endregion

// #region cart

/**
 * 获取购物车中商品列表
 * @returns 返回购物车商品列表数组
 */
export const getCartProductList = async (): Promise<CartItem[]> => {
  return await fetchInstance({ baseUrl: 'cart/list', token: getCookie('token'), method: 'POST' });
};

/**
 * 提交订单
 * @param ids 购物车记录id
 * @param account 总价
 * @param addressId 地址id
 */
export const submitOrder = async (ids: number[], account: number, addressId: number) => {
  return await fetchInstance({
    baseUrl: 'order/confirm',
    token: getCookie('token'),
    data: { ids, account, addressId },
    method: 'POST',
  });
};

/**
 * 添加商品到购物车
 * @param productId - 商品ID
 * @param count - 商品数量
 * @returns 返回添加结果，包含操作状态信息
 */
export const addCart = async (productId: number, count: number) => {
  return await fetchInstance({
    baseUrl: 'cart/add',
    token: getCookie('token'),
    data: { pid: productId, count },
    method: 'POST',
  });
};

/**
 * 删除购物车中的商品
 * @param cartIds - 购物车记录ID数组
 * @returns 返回删除结果，包含操作状态信息
 */
export const deleteCart = async (cartIds: number[]) => {
  return await fetchInstance({
    baseUrl: 'cart/remove',
    token: getCookie('token'),
    data: { ids: cartIds },
    method: 'POST',
  });
};

/**
 * 指定购物车记录商品数量-1
 * @param cartId - 购物车记录ID
 * @returns 返回请求结果，包含操作状态信息
 */
export const decreaseProductInCart = async (cartId: number) => {
  return await fetchInstance({
    baseUrl: `cart/decrease/${cartId}`,
    token: getCookie('token'),
    method: 'POST',
  });
};

/**
 * 指定购物车记录商品数量+1
 * @param cartId - 购物车记录ID
 * @returns 返回请求结果，包含操作状态信息
 */
export const increaseProductInCart = async (cartId: number) => {
  return await fetchInstance({
    baseUrl: `cart/increase/${cartId}`,
    token: getCookie('token'),
    method: 'POST',
  });
};

// #endregion

// #region address

/**
 * 获取默认地址
 * @returns 返回默认地址信息对象
 */
export const getDefaultAddress = async (): Promise<Address> => {
  return await fetchInstance({ baseUrl: 'address/get_default', token: getCookie('token') });
};

/**
 * 获取用户地址列表
 * @returns 用户地址列表
 */
export const getAddressList = async (): Promise<Address[]> => {
  return await fetchInstance({ baseUrl: 'address/list', token: getCookie('token') });
};

/**
 * 获取指定地址ID的地址信息
 * @param addressId - 地址ID
 * @returns 返回地址信息对象
 */
export const getTargetAddress = async (addressId: number): Promise<Address> => {
  return await fetchInstance({ baseUrl: `address/model/${addressId}`, token: getCookie('token') });
};

/**
 * 添加新地址
 * @param address - 地址信息对象(不包含id)
 * @returns 返回添加结果，包含操作状态信息
 */
export const addAddress = async (address: Omit<Address, 'id'>) => {
  return await fetchInstance({
    baseUrl: 'address/add',
    data: address,
    token: getCookie('token'),
    method: 'POST',
  });
};

/**
 * 更新地址信息
 * @param address - 要更新的地址信息对象
 * @returns 返回更新结果，包含操作状态信息
 */
export const updateAddress = async (address: Address) => {
  return await fetchInstance({
    baseUrl: `address/update`,
    data: address,
    token: getCookie('token'),
    method: 'POST',
  });
};

/**
 * 删除指定地址
 * @param addressId - 地址ID
 * @returns 返回删除结果，包含操作状态信息
 */
export const deleteAddress = async (addressId: number) => {
  return await fetchInstance({ baseUrl: `address/remove/${addressId}`, token: getCookie('token') });
};

/**
 * 设置某地址为默认地址
 * @param addressId - 地址ID
 * @returns 返回设置结果，包含操作状态信息
 */
export const setDefaultAddress = async (addressId: number) => {
  return await fetchInstance({
    baseUrl: `address/set_default/${addressId}`,
    token: getCookie('token'),
  });
};

// #endregion

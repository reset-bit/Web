export interface Product {
  id: number;
  name: string;
  avatar: string;
  price: number;
  bannerImgs?: string;
  brief?: string;
  cid?: number; // 分类id
  otherImgs?: string;
  rate?: number;
  sale?: number;
}

export interface Category {
  id: number;
  name: string;
  avatar?: string;
  fid?: number; // 父级分类id
}

export type ListOrderCol = 'price' | 'sale' | 'rate';

export type ListOrderDir = 'asc' | 'desc';

export type CartStatus = 'default' | 'empty' | 'loggedIn';

export interface CartItem {
  id: number;
  name: string;
  avatar: string;
  price: number;
  count: number;
  biref?: string;
  pid: number;
}

export interface Address {
  id: number;
  name: string;
  receiveName: string;
  receivePhone: string;
  receiveRegion: string;
  receiveDetail: string;
  isDefault: boolean;
}

// #region services

export interface ServiceOptions {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}

// #endregion

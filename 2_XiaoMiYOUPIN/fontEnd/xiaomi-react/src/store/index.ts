import { create } from 'zustand';
import type { CartItem } from '@/types';

// #region GlobalStore
interface GlobalStoreState {
  userName: string;
  isLogin: boolean;
  cartList: CartItem[];
}

interface GlobalStoreAction {
  setUserName: (targetName: string) => void;
  setLogin: (targetStatus: boolean) => void;
  setCartList: (targetList: CartItem[]) => void;
}

const globalStore = create<GlobalStoreState & GlobalStoreAction>(set => ({
  userName: '',
  setUserName: (targetName: string) => set({ userName: targetName }),
  isLogin: false,
  setLogin: (targetStatus: boolean) => set({ isLogin: targetStatus }),
  cartList: [],
  setCartList: (targetList: CartItem[]) => set({ cartList: targetList }),
}));

export const useGlobalStore = globalStore;
export const getGlobalStore = () => globalStore.getState();
// #endregion

// #region ListStore
interface ListStoreState {
  focusedCategoryId: number | null;
}

interface ListStoreAction {
  setFocusedCategoryId: (targetId: number) => void;
}

export const useListStore = create<ListStoreState & ListStoreAction>(set => ({
  focusedCategoryId: null,
  setFocusedCategoryId: (targetId: number) => set({ focusedCategoryId: targetId }),
}));
// #endregion

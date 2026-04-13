import { useMutation } from '@tanstack/react-query';
import { removeCookie, setCookie } from 'typescript-cookie';
import { useShallow } from 'zustand/react/shallow';
import { getCartProductList, login, register } from '@/api';
import { useGlobalStore } from '@/store';
import type { ServiceOptions } from '@/types';

export const useLogin = (name: string, password: string, options?: ServiceOptions) => {
  const { setLogin, setUserName, setCartList } = useGlobalStore(
    useShallow(state => ({
      setLogin: state.setLogin,
      setUserName: state.setUserName,
      setCartList: state.setCartList,
    }))
  );

  return useMutation({
    mutationFn: async () => login(name, password),
    onSuccess: async token => {
      setCookie('token', token as string, { expires: 7 });
      setLogin(true);
      setUserName(name);
      if (typeof options?.onSuccess === 'function') {
        options.onSuccess();
      }
      const json = (await getCartProductList()) || [];
      setCartList(json);
    },
    onError: options?.onError,
  });
};

export const useLogout = () => {
  const { setLogin, setCartList } = useGlobalStore(
    useShallow(state => ({ setLogin: state.setLogin, setCartList: state.setCartList }))
  );
  const logout = () => {
    removeCookie('token');
    setLogin(false);
    setCartList([]);
  };
  return { mutate: logout };
};

export const useRegister = (
  name: string,
  password: string,
  phone: string,
  options?: ServiceOptions
) => {
  return useMutation({
    mutationFn: async () => register(name, password, phone),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

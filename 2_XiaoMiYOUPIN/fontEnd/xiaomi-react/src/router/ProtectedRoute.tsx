import { Navigate, Outlet } from 'react-router-dom';
import { useGlobalStore } from '@/store';

export const ProtectedRoute = () => {
  const isLogin = useGlobalStore(state => state.isLogin);
  return isLogin ? <Outlet /> : <Navigate to={'/login'} replace />;
};

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginProtocol, RouteErrorBoundary } from '@/components';
import { Global } from '@/layout';
import {
  Address,
  Cart,
  Category,
  Detail,
  Home,
  List,
  Login,
  Order,
  Profile,
  Register,
  Search,
} from '@/pages';
import { categoryLoader, globalLoader, orderLoader } from './loaders';
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    element: <Global />,
    loader: globalLoader,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/category',
        element: <Category />,
        loader: categoryLoader,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/detail',
        element: <Detail />,
      },
      {
        path: '/list',
        element: <List />,
      },
      {
        path: '/login',
        element: (
          <LoginProtocol>
            <Login />
          </LoginProtocol>
        ),
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: '/address',
        element: <Address />,
      },
      {
        path: '/order',
        element: <Order />,
        loader: orderLoader,
      },
    ],
  },
  { path: '*', element: <Navigate to="/home" /> },
]);

export default router;

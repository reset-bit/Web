import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import router from './router/routes';

import './App.css';

const queryClient = new QueryClient();

export const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#c5945b',
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ConfigProvider>
);

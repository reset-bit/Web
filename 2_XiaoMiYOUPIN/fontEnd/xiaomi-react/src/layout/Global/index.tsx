import { Outlet } from 'react-router-dom';
import { Footer } from '@/components';

import './index.css';

export const Global = () => (
  <div className="global-layout">
    <main className="global-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

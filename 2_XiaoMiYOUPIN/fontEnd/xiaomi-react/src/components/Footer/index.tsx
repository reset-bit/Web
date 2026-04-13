import { Badge } from 'antd';
import { NavLink } from 'react-router-dom';
import { useGlobalStore } from '@/store';

import './index.css';

export const Footer = () => {
  const cartList = useGlobalStore(state => state.cartList);

  return (
    <div className="footer">
      <NavLink className="footer-item" to="/home">
        <i className="avatar"></i>
        <span>首页</span>
      </NavLink>
      <NavLink className="footer-item" to="/category">
        <i className="avatar"></i>
        <span>分类</span>
      </NavLink>
      <NavLink className="footer-item" to="/cart">
        <Badge count={cartList.length} size="small" offset={[-4, 6]}>
          <i className="avatar"></i>
          <span>购物车</span>
        </Badge>
      </NavLink>
      <NavLink className="footer-item" to="/profile">
        <i className="avatar"></i>
        <span>个人</span>
      </NavLink>
    </div>
  );
};

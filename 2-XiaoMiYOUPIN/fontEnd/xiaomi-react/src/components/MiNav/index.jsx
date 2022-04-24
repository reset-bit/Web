import React from 'react';
import { NavLink } from 'react-router-dom';
import style from './index.module.styl';

// class MiNav extends Component {
//         render() {
//                 return (
//                         <div className={style['nav-content']}>
//                                 <NavLink activeClassName={style['active']} className={style['footer-item']} to="/home"><i className={style['avatar']}></i><span>首页</span></NavLink>
//                                 <NavLink activeClassName={style['active']} className={style['footer-item']} to="/category"><i className={style['avatar']}></i><span>分类</span></NavLink>
//                                 <NavLink activeClassName={style['active']} className={style['footer-item']} to="/cart"><i className={style['avatar']}></i><span>购物车</span></NavLink>
//                                 <NavLink activeClassName={style['active']} className={style['footer-item']} to="/profile"><i className={style['avatar']}></i><span>个人</span></NavLink>
//                         </div>
//                 );
//         }
// }
//
// export default MiNav;

export default () => (
        <div className={style['nav-content']}>
                <NavLink activeClassName={style['active']} className={style['footer-item']} to="/home"><i className={style['avatar']}></i><span>首页</span></NavLink>
                <NavLink activeClassName={style['active']} className={style['footer-item']} to="/category"><i className={style['avatar']}></i><span>分类</span></NavLink>
                <NavLink activeClassName={style['active']} className={style['footer-item']} to="/cart"><i className={style['avatar']}></i><span>购物车</span></NavLink>
                <NavLink activeClassName={style['active']} className={style['footer-item']} to="/profile"><i className={style['avatar']}></i><span>个人</span></NavLink>
        </div>
);
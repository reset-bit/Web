import { RightOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { ErrorBoundary } from '@/components';
import { useLogout } from '@/services';
import { useGlobalStore } from '@/store';
import style from './index.module.css';

const ModuleName = '_Profile_';

const optionBtns = [
  {
    icon: '/images/profile_big01.png',
    name: '待付款',
  },
  {
    icon: '/images/profile_big02.png',
    name: '待收货',
  },
  {
    icon: '/images/profile_big03.png',
    name: '评价',
  },
  {
    icon: '/images/profile_big04.png',
    name: '退款/售后',
  },
];

type MenuItem = {
  name: string;
  icon: string;
  fPart: number;
  href?: string;
};

const menuList: MenuItem[] = [
  {
    icon: '/images/ucenter_icon_myassets.png',
    name: '我的资产',
    fPart: 1,
  },
  {
    icon: '/images/ucenter_icon_coupon_new.png',
    name: '优惠券',
    fPart: 1,
  },
  {
    icon: '/images/ucenter_icon_collection.png',
    name: '我的收藏',
    fPart: 1,
  },
  {
    icon: '/images/ucenter_icon_address.png',
    name: '地址管理',
    fPart: 2,
    href: '/address',
  },
  {
    icon: '/images/ucenter_icon_qualification.png',
    name: '资质证照',
    fPart: 2,
  },
  {
    icon: '/images/ucenter_icon_save.png',
    name: '协议规则',
    fPart: 2,
  },
  {
    icon: '/images/ucenter_icon_feedback.png',
    name: '帮助与反馈',
    fPart: 2,
  },
];

export const Profile = () => {
  const { userName, isLogin } = useGlobalStore(
    useShallow(state => ({ userName: state.userName, isLogin: state.isLogin }))
  );

  const [modal, modalContext] = Modal.useModal();
  const [messageApi, messageContext] = message.useMessage();
  const { mutate: logout } = useLogout();
  const onLogout = () => {
    modal.confirm({
      width: 300,
      centered: true,
      content: '确定退出登录吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        logout();
        messageApi.success('操作成功');
      },
    });
  };

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={style.content}>
          <div className={style['user-wrapper']}>
            <img src="/images/avatar.png" alt="" />
            <Link className={style['name-default-wrapper']} to={isLogin ? '' : '/login'}>
              <span>{isLogin ? userName : '请登录'}</span>
              <RightOutlined />
            </Link>
            <div className={style['name-wrapper']}>
              <span className={style.name}></span>
            </div>
          </div>

          <Link className={style.order} to="order">
            <span>我的订单</span>
            <i className="iconfont icon-next"></i>
          </Link>
          <div className={style['btn-wrapper']}>
            {optionBtns.map((item, index) => (
              <Link to="" key={index}>
                <img src={item.icon} alt="" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className={style['main-part-1']}>
            {menuList
              .filter(item => item.fPart === 1)
              .map(item => (
                <Link
                  className={`${style['item-bar']} ${style['border-1px']}`}
                  to=""
                  key={item.name}
                >
                  <span>
                    <img src={item.icon} alt="" />
                    {item.name}
                  </span>
                  <RightOutlined />
                </Link>
              ))}
          </div>
          <div className={style['main-part-2']}>
            {menuList
              .filter(item => item.fPart === 2)
              .map(item => (
                <Link
                  className={`${style['item-bar']} ${style['border-1px']}`}
                  to={item.href || ''}
                  key={item.name}
                >
                  <span>
                    <img src={item.icon} alt="" />
                    {item.name}
                  </span>
                  <RightOutlined />
                </Link>
              ))}
          </div>

          {isLogin && (
            <div className={style['btn-exit-wrapper']}>
              <span className={style['btn-exit']} onClick={() => onLogout()}>
                退出
              </span>
            </div>
          )}
          {modalContext}
          {messageContext}
        </div>
      </div>
    </ErrorBoundary>
  );
};

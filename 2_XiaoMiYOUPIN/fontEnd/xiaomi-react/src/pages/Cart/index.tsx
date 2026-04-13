import { LeftOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { ErrorBoundary } from '@/components';
import { useDeleteCart } from '@/services';
import { useGlobalStore } from '@/store';
import type { CartItem } from '@/types';
import { CartItemComponent } from './CartItem';
import type { CartItemComponentRef } from './CartItem';
import style from './index.module.css';

const ModuleName = '_Cart_';

export const Cart = () => {
  const navigator = useNavigate();

  const { isLogin, cartList } = useGlobalStore(
    useShallow(state => ({
      isLogin: state.isLogin,
      cartList: state.cartList,
    }))
  );
  const status = useMemo(() => {
    if (!isLogin) {
      return 'default';
    } else if (cartList.length === 0) {
      return 'empty';
    } else {
      return 'logged';
    }
  }, [isLogin, cartList]);

  const [, forceUpdate] = useState(new Date());
  useEffect(() => {
    forceUpdate(new Date());
  }, [cartList]);

  // #region 状态响应
  const cartItemRefs = useRef<(CartItemComponentRef | null)[]>([]);
  const isCheckedAll = cartItemRefs.current.every(cartItem => cartItem?.checked);
  const toggleCheckedAll = (target?: boolean) => {
    cartItemRefs.current.forEach(cartItem =>
      cartItem?.setChecked(target !== undefined ? target : !isCheckedAll)
    );
  };

  const total = cartList
    .filter((_, index) => cartItemRefs.current[index]?.checked)
    .reduce((accumulator, curValue, index) => {
      return accumulator + curValue.price * (cartItemRefs.current[index]?.count || 0);
    }, 0);

  const [isEdit, setEdit] = useState(false);
  const isValidate = cartItemRefs.current.some(cartItem => cartItem?.checked);

  const [modal, modalContext] = Modal.useModal();
  const [messageApi, messageContext] = message.useMessage();
  const onBuy = () => {
    if (!isValidate) return;
    const selectedCartItemComp = cartItemRefs.current.filter(cartItem => cartItem?.checked);
    navigator('/order', {
      state: {
        cartItems: cartList.filter(({ id }) => selectedCartItemComp.some(comp => comp?.id === id)),
        total,
      },
    });
  };
  const { mutate: deleteCart } = useDeleteCart({
    onSuccess: () => {
      messageApi.success('操作成功');
    },
    onError: () => {
      messageApi.error('操作失败');
    },
  });
  const onDelete = () => {
    if (!isValidate) return;
    modal.confirm({
      width: 300,
      centered: true,
      content: '确定要删除选中商品吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        const selectedIds = cartItemRefs.current
          .filter(cartItem => cartItem?.checked)
          .map((cartItem: CartItemComponentRef | null) => cartItem!.id);
        deleteCart(selectedIds);
      },
    });
  };
  // #endregion

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container} ${style[status]}`}>
        <div className={style.header}>
          <LeftOutlined onClick={() => navigator(-1)} />
          <span className={style.title}>购物车</span>
          <span
            className={style.option}
            onClick={() => {
              setEdit(!isEdit);
              toggleCheckedAll(false);
            }}
          >
            {!isEdit ? '编辑' : '取消'}
          </span>
        </div>
        <div className={style['content-wrapper']}>
          <img src="/images/cart_header_bg.png" alt="" />

          {status === 'logged' && (
            <div className={style['content']}>
              <ul className={style.list}>
                {cartList.map((item: CartItem, index) => (
                  <CartItemComponent
                    key={item.id}
                    ref={(el: CartItemComponentRef | null) => {
                      cartItemRefs.current[index] = el;
                    }}
                    forceUpdate={forceUpdate}
                    {...item}
                  />
                ))}
              </ul>
              <div className={style['bottom-bar']}>
                <span className={style.left} onClick={() => toggleCheckedAll()}>
                  <i
                    className={`${style.checkbox} ${style.all} ${isCheckedAll && style.checked}`}
                  ></i>
                  全选
                </span>
                <span className={style.right}>
                  <span className={style['total-price-wrapper']}>
                    合计：
                    <span className={style['total-wrapper']}>
                      ￥<span className="total">{total}</span>.00
                    </span>
                  </span>
                  <span
                    className={`${style['btn-option']} ${isValidate && style.active}`}
                    onClick={() => (!isEdit ? onBuy() : onDelete())}
                  >
                    {!isEdit ? '结算' : '删除'}
                  </span>
                  {modalContext}
                  {messageContext}
                </span>
              </div>
            </div>
          )}

          {status === 'empty' && (
            <div className={style['empty-wrapper']}>
              <img src="/images/no_result_cart.png" alt="" />
              <p className={style.tip}>目前没有添加商品哦</p>
              <Link className={style['btn-home']} to="/home">
                去首页逛逛
              </Link>
            </div>
          )}

          {status === 'default' && (
            <div className={style['default-wrapper']}>
              <img src="/images/no_result_cart.png" alt="" />
              <p className={style.tip}>登录后才能看到商品哦</p>
              <Link className={style['btn-login']} to="/login">
                立即登录
              </Link>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

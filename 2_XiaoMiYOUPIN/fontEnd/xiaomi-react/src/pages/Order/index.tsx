import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { useAddressDrawer } from '@/hooks';
import { updateCart, useConfirmOrder } from '@/services';
import type { Address, CartItem } from '@/types';
import style from './index.module.css';

const ModuleName = '_Order_';

export const Order = () => {
  const navigator = useNavigate();
  const { state } = useLocation();

  const defaultAddress = useLoaderData() as Address | undefined;
  const [address, setAddress] = useState(defaultAddress);
  const [drawerContext, { showDrawer }] = useAddressDrawer({ address, updateAddress: setAddress });

  // 交互校验
  const [isValidate, setValidate] = useState<boolean>(false);
  useEffect(() => {
    setValidate(address !== null);
  }, [address]);

  // 提交订单
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate: confirmOrder } = useConfirmOrder({
    onSuccess: async () => {
      await updateCart();
      setTimeout(() => {
        navigator(-1);
      }, 1000);
      messageApi.success('提交订单成功');
    },
    onError: () => {
      messageApi.error('提交订单失败');
    },
  });

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <img src="/images/cart_header_bg.png" alt="" />
        <div className={style.header}>
          <LeftOutlined onClick={() => navigator(-1)} />
          <span className={style.title}>确认订单</span>
        </div>

        <div className={style.content}>
          <div className={style['receive-area']}>
            <div onClick={() => showDrawer()}>
              {address ? (
                <div className={style['receive-content']}>
                  <p>
                    <span className={style['receive-name']}>{address.receiveName}</span>
                    <span className={style['receive-phone']}>{address.receivePhone}</span>
                  </p>
                  <div className={style['receive-address']}>
                    {address.receiveRegion}
                    {address.receiveDetail}
                  </div>
                </div>
              ) : (
                <div className={style['receive-content-default']}>
                  <p>请添加收货地址</p>
                </div>
              )}
              <RightOutlined
                className={style['icon-next']}
                style={{ color: address ? 'gray' : 'red' }}
              />
            </div>
            {drawerContext}
          </div>

          <div className={style['product-area']}>
            {state?.cartItems?.map((product: CartItem) => (
              <div className={style['product-item']} key={product.id}>
                <div className={style['product-header']}>
                  <img src="/images/mi_shop_icon.png" alt="" />
                  <span>小米自营</span>
                </div>
                <div className={style['product']}>
                  <img src={`..${product?.avatar || ''}`} alt="" className={style['avatar']} />
                  <div className={style['product-content']}>
                    <h6 className={style['name']}>{product?.name || ''}</h6>
                    <span className={style['product-content-detail']}>
                      <span className={style['price-wrapper']}>
                        ￥<span className={style['price']}>{product?.price || 0}</span>.00
                      </span>
                      <span className={style['count-wrapper']}>
                        ×<span className={style['count']}>{product?.count || 0}</span>
                      </span>
                    </span>
                  </div>
                </div>
                <div className={style['content-item']}>
                  <span>发票类型</span>
                  <span>
                    个人电子发票
                    <RightOutlined />
                  </span>
                </div>
                <div className={style['content-item']}>
                  <span>配送方式</span>
                  <span>快递配送</span>
                </div>
                <div className={style['content-item']}>
                  <span>买家留言</span>
                  <input type="text" placeholder="填写内容需与商家协商并确认，45字以内" />
                </div>
              </div>
            ))}
          </div>

          <div className={style['price-area']}>
            <div className={style['content-item']}>
              <span>商品总价</span>
              <span className={style['total-wrapper']}>
                ￥<span className={style.total}>{state?.total || 0}</span>.00
              </span>
            </div>
            <div className={style['content-item']}>
              <span>运费</span>
              <span>-￥0.00</span>
            </div>
            <div className={style['content-item']}>
              <span>优惠券</span>
              <span>
                暂无可用
                <RightOutlined />
              </span>
            </div>
          </div>
        </div>

        <div className={style['bottom-wrapper']}>
          <div className={style.left}>
            合计：
            <span className={style['total-wrapper']}>
              ￥<span className={style.total}>{state?.total || 0}</span>.00
            </span>
            免运费
          </div>
          <div
            className={`${style.right} ${isValidate && style.active}`}
            onClick={() => {
              if (!address) return;
              confirmOrder({
                ids: state.cartItems.map((item: CartItem) => item.id),
                account: state.total,
                addressId: address.id,
              });
            }}
          >
            提交订单
          </div>
        </div>
        {contextHolder}
      </div>
    </ErrorBoundary>
  );
};

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Anchor, Badge, FloatButton } from 'antd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AddCartAndBuyBtn, ErrorBoundary } from '@/components';
import { useAddressDrawer, useQueryStatus } from '@/hooks';
import { useDefaultAddress, useProduct } from '@/services';
import { useGlobalStore } from '@/store';
import type { Address } from '@/types';
import { useProductDrawer } from './useProductDrawer';

import 'swiper/swiper-bundle.css';

import style from './index.module.css';

const ModuleName = '_Detail_';

export const Detail = () => {
  const navigate = useNavigate();
  const isLogin = useGlobalStore(state => state.isLogin);

  // #region init
  const { state } = useLocation();
  const { data: product } = useQueryStatus({ result: useProduct(state.id) });

  const cartList = useGlobalStore(state => state.cartList);
  const { data: defaultAddress } = useDefaultAddress();
  const [address, setAddress] = useState<Address | undefined>(defaultAddress);
  const [addressDrawerContext, { showDrawer: showAddressDrawer }] = useAddressDrawer({
    address,
    updateAddress: setAddress,
  });
  // #endregion

  // #region scroll to top
  const getContentTarget = () => {
    const element = document.querySelector('.detail-content');
    return element instanceof HTMLElement ? element : window;
  };
  // #endregion

  // #region product drawer
  const [productDrawerContext, { count, showDrawer: showProductDrawer }] = useProductDrawer({
    id: state.id,
    avatar: product?.avatar || '',
    price: product?.price || 0,
    count: state.count || 1,
    address: defaultAddress,
  });
  // #endregion

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={`${style.header} detail-header`}>
          <LeftOutlined className={style['icon-back']} onClick={() => navigate(-1)} />
        </div>
        <FloatButton.BackTop
          target={getContentTarget}
          visibilityHeight={100}
          style={{ top: 0, left: 0, width: '100%', borderRadius: 0 }}
          icon={<></>}
          description={
            <div className={`${style.header} ${style.active} detail-header`}>
              <LeftOutlined className={style['icon-back']} onClick={() => navigate(-1)} />
              <Anchor
                className={style['header-content']}
                direction="horizontal"
                getContainer={() => document.querySelector('.detail-content') as HTMLElement}
                replace
                items={[
                  {
                    key: 'main',
                    href: '#main',
                    title: '商品',
                  },
                  {
                    key: 'detail',
                    href: '#detail',
                    title: '详情',
                  },
                ]}
              />
            </div>
          }
        />

        <div className={`${style.content} detail-content`}>
          <Swiper
            className={`${style['swiper-container']} ${style.banner}`}
            id="main"
            modules={[Pagination, Autoplay]}
            loop
            autoplay={{ disableOnInteraction: false }}
            pagination={{
              clickable: true,
            }}
          >
            {product?.bannerImgs?.split(',').map((item, index) => (
              <SwiperSlide key={index}>
                <img src={item} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>

          <p className={style['price-wrapper']}>
            ￥<span className={style.price}>{product?.price}</span>.00
          </p>
          <span className={style.name}>{product?.name}</span>
          <p className={style.brief}>{product?.brief}</p>

          <div className={style['option-wrapper']}>
            <div className={`${style['option-item']} ${style['option-count']}`}>
              <span className={style['item-title']}>已选</span>
              <p className={style['count-wrapper']}>
                <span className={style.count}>{count}</span>件
              </p>
              <RightOutlined style={{ color: 'gray' }} onClick={showProductDrawer} />
            </div>
            <div className={`${style['option-item']} ${style['option-address']}`}>
              <span className={style['item-title']}>送至</span>
              <p className={style['address-wrapper']}>
                <span className={style.address}>
                  {`${address?.receiveRegion ?? ''}${address?.receiveDetail ?? ''}`}
                </span>
              </p>
              <RightOutlined
                style={{ color: 'gray' }}
                onClick={() => {
                  if (!isLogin) {
                    navigate('/login');
                    return;
                  }
                  showAddressDrawer();
                }}
              />
            </div>
          </div>

          <div className={style['detail-wrapper']} id="detail">
            <h6 className={style['detail-title']}>商品详情</h6>
            <div className={style.detail}>
              {product?.otherImgs?.split(',').map((item, index) => (
                <img src={item} key={index} />
              ))}
            </div>
          </div>
          <FloatButton.BackTop
            target={getContentTarget}
            visibilityHeight={500}
            style={{ bottom: 70 }}
          />
        </div>

        <div className={style['bottom-wrapper']}>
          <div className={style['icon-wrapper']}>
            <img src="/images/mi_shop_icon.png" alt="" />
            <h6>小米</h6>
          </div>
          <div className={`${style['icon-wrapper']} ${style.cart}`}>
            <Badge count={cartList.length} size="small">
              <img src="/images/icon_shop_cart.png" alt="" />
              <Link to="/cart">
                <h6>购物车</h6>
              </Link>
            </Badge>
          </div>
          <AddCartAndBuyBtn
            pid={state.id}
            count={count}
            total={product?.price || 0 * count}
            address={address}
          />
        </div>
        {productDrawerContext}
        {addressDrawerContext}
      </div>
    </ErrorBoundary>
  );
};

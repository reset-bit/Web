import { Drawer } from 'antd';
import { useState } from 'react';
import { AddCartAndBuyBtn } from '@/components';
import { useCount } from '@/hooks';
import type { Address } from '@/types';
import style from './index.module.css';

export const useProductDrawer = (props: {
  id: number;
  avatar: string;
  price: number;
  count: number;
  address: Address | undefined;
}): [context: React.ReactNode, { count: number; showDrawer: () => void }] => {
  const { id, price, avatar, count, address } = props;

  const [visible, setVisible] = useState(false);

  const [curCount, decrease, increase] = useCount({ defaultCount: count });

  const context = (
    <Drawer
      placement="bottom"
      className={style['count-container']}
      style={{ borderRadius: '20px 20px 0 0' }}
      open={visible}
      closeIcon={null}
      onClose={() => setVisible(false)}
      footer={
        <AddCartAndBuyBtn pid={id} count={curCount} total={price * curCount} address={address} />
      }
    >
      <div className={style.top}>
        <img src={avatar} />
        <div className={style['top-content']}>
          <span className={style['price-wrapper']}>
            ￥<span className={style.price}>{price}</span>
          </span>
          <span className={style['count-wrapper']}>
            <span className={style.count}>已选：{curCount}件</span>
          </span>
        </div>
      </div>
      <div className={style['count-area']}>
        <span>数量</span>
        <span className={style['count-wrapper']}>
          <span
            className={`${style['btn-decrease']} ${curCount > 1 && style.active}`}
            onClick={decrease}
          >
            -
          </span>
          <span className={style.count}>{curCount}</span>
          <span
            className={`${style['btn-increase']} ${curCount < 5 && style.active}`}
            onClick={increase}
          >
            +
          </span>
        </span>
      </div>
    </Drawer>
  );

  return [context, { count: curCount, showDrawer: () => setVisible(true) }];
};

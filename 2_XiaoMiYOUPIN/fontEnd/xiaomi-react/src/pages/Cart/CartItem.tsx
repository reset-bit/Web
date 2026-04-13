import { memo, useEffect, useImperativeHandle, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCount } from '@/hooks';
import { useDecreaseProduct, useIncreaseProduct } from '@/services';
import type { CartItem } from '@/types';
import style from './index.module.css';

const MAX = 5;
const MIN = 1;

export interface CartItemComponentRef {
  id: number;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  count: number;
}

type CartItemComponentProps = CartItem & {
  ref: React.Ref<CartItemComponentRef>;
  forceUpdate: (date: Date) => void;
};

// 每项商品
export const CartItemComponent = memo((props: CartItemComponentProps) => {
  const [checked, setChecked] = useState(false);

  const { mutate: onDecrease } = useDecreaseProduct(props.id);
  const { mutate: onIncrease } = useIncreaseProduct(props.id);
  const [count, decrease, increase] = useCount({
    defaultCount: props.count,
    max: MAX,
    min: MIN,
    onDecrease,
    onIncrease,
  });

  useEffect(() => {
    props.forceUpdate(new Date());
  }, [checked, count]);

  useImperativeHandle(props.ref, () => {
    return {
      id: props.id,
      checked,
      setChecked,
      count,
    };
  });

  return (
    <li>
      <i
        className={`${style.checkbox} ${checked && style.checked}`}
        onClick={() => setChecked(!checked)}
      ></i>
      <div className={style['list-content-wrapper']}>
        <Link to="/detail" state={{ id: props.pid, count }}>
          <img src={props.avatar} />
        </Link>
        <div className={style['list-content']}>
          <Link to="/detail" state={{ id: props.pid, count }}>
            <h6 className={style.name}>{props.name}</h6>
          </Link>
          <div className={style['price-wrapper']}>
            <span className={style['price-wrapper']}>
              ￥<span className={style.price}>{props.price}</span>.00
            </span>
            <span className={style['count-wrapper']}>
              <span
                className={`${style['btn-decrease']} ${count > MIN && style.active}`}
                onClick={decrease}
              >
                -
              </span>
              <span className={style.count}>{count}</span>
              <span
                className={`${style['btn-increase']} ${count < MAX && style.active}`}
                onClick={increase}
              >
                +
              </span>
            </span>
          </div>
        </div>
      </div>
    </li>
  );
});

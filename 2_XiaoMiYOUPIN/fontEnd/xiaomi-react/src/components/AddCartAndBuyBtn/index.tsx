import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddCart, useBuyImmediately } from '@/services';
import { useGlobalStore } from '@/store';
import type { Address } from '@/types';

interface AddCartAndBuyBtnProps {
  pid: number;
  count: number;
  total: number;
  address: Address | undefined;
}

export const AddCartAndBuyBtn = (props: AddCartAndBuyBtnProps) => {
  const { pid, count, total, address } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const validateLogin = () => {
    if (!isLogin) {
      navigate('/login');
      return false;
    }
    return true;
  };

  // 添加购物车
  const isLogin = useGlobalStore(state => state.isLogin);
  const { mutate: addCart } = useAddCart(pid, count, {
    onSuccess: () => {
      messageApi.success('操作成功');
    },
    onError: () => messageApi.error('操作失败'),
  });
  const onAddCart = () => {
    if (!validateLogin()) return;
    addCart();
  };

  // 立即购买
  const { mutate: buyImmediately } = useBuyImmediately({
    onSuccess: () => {
      messageApi.success('操作成功');
      navigate(-1);
    },
    onError: () => messageApi.error('操作失败'),
  });
  const onBuyNow = () => {
    if (!validateLogin()) return;
    if (!address) {
      messageApi.warning('请选择收货地址');
      return;
    }
    buyImmediately({ pid: pid, count, total, addressId: address?.id || 0 });
  };

  return (
    <div className="add-cart-and-but-btn" style={{ width: '100%' }}>
      <span
        style={{
          display: 'inline-block',
          width: '50%',
          boxSizing: 'border-box',
          borderRadius: '20px 0 0 20px',
          backgroundColor: '#ebb355',
          padding: '8px 26px',
          fontSize: '14px',
          color: '#fff',
          textAlign: 'center',
        }}
        onClick={onAddCart}
      >
        加入购物车
      </span>
      <span
        style={{
          display: 'inline-block',
          width: '50%',
          boxSizing: 'border-box',
          borderRadius: '0 20px 20px 0',
          backgroundColor: '#ff3000',
          padding: '8px 26px',
          fontSize: '14px',
          color: '#fff',
          textAlign: 'center',
        }}
        onClick={onBuyNow}
      >
        立即购买
      </span>
      {contextHolder}
    </div>
  );
};

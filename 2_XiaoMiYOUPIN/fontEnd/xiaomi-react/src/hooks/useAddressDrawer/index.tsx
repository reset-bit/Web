import { Drawer, Radio } from 'antd';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useAddressList } from '@/services';
import type { Address } from '@/types';
import style from './index.module.css';

type AddressDrawerProps = {
  address: Address | undefined;
  updateAddress: Dispatch<SetStateAction<Address | undefined>>;
};

type AddressDrawerReturn = [context: React.ReactNode, { showDrawer: () => void }];

export const useAddressDrawer = (props: AddressDrawerProps): AddressDrawerReturn => {
  const { address, updateAddress } = props;

  const [visible, setVisible] = useState(false);
  const { mutate: getAddressList, data: addressList } = useAddressList();

  const showDrawer = () => {
    getAddressList();
    setVisible(true);
  };

  const context = (
    <Drawer
      placement="bottom"
      className={style['count-container']}
      style={{ borderRadius: '20px 20px 0 0' }}
      open={visible}
      closeIcon={null}
      onClose={() => setVisible(false)}
    >
      <div className={style['address-container']}>
        <div className={style['top']}>配送地址</div>
        <div className={style['address-content']}>
          {addressList && addressList.length > 0 ? (
            <div className={style['address-wrapper']}>
              <Radio.Group
                value={address?.id}
                onChange={e => updateAddress(addressList.find(item => item.id === e.target.value))}
              >
                {addressList.map(item => (
                  <Radio value={item.id} key={item.id}>
                    <p>{item.receiveName}</p>
                    <div className={style['address-item-content']}>
                      {item.receiveRegion} {item.receiveDetail}
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ) : (
            <span className={style['default-text']}>暂无收货地址</span>
          )}
        </div>
        <div className={style['bottom-wrapper']}>
          <span className={style['btn-other-address']}>选择其他配送地址</span>
        </div>
      </div>
    </Drawer>
  );

  return [context, { showDrawer }];
};

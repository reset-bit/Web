import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { useQueryStatus } from '@/hooks';
import { useAllAddress } from '@/services';
import type { Address as AddressType } from '@/types';
import style from './index.module.css';
import { useEditAddressDialog } from './useEditAddressDialog';

const ModuleName = '_Address_';

export const Address = () => {
  const { context, openDialog } = useEditAddressDialog();

  const { RenderResult: List } = useQueryStatus({
    result: useAllAddress(),
    render: addressList => (
      <div className={style.content}>
        <ul className={style.list}>
          {addressList.map((item: AddressType) => (
            <li key={item.id} className={item.isDefault ? style.default : ''}>
              <div>
                <div>
                  <span className={style['receive-name']}>{item.receiveName}</span>
                  <span className={style['receive-phone']}>{item.receivePhone}</span>
                </div>
                <div>
                  <span className={style['is-default']}>默认</span>
                  <span className={style['receive-region']}>{item.receiveRegion}</span>{' '}
                  <span className={style['receive-detail']}>{item.receiveDetail}</span>
                </div>
              </div>
              <EditOutlined onClick={() => openDialog(item.id)} />
            </li>
          ))}
        </ul>
      </div>
    ),
    options: {
      EmptyElement: () => (
        <div className={style['empty-content']}>
          <img src="../images/no_result_address.png" alt="" />
          <span>您还没有收货地址，点击下方+新建</span>
        </div>
      ),
    },
  });

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={style.header}>
          <Link to="/profile">
            <LeftOutlined />
          </Link>
          <span className={style.title}>收货地址</span>
        </div>

        <div className={style['content-wrapper']}>
          <List />

          <div className={style['btn-add-wrapper']}>
            <div className={style['btn-add']} onClick={() => openDialog()}>
              + 添加地址
            </div>
          </div>
        </div>
        {context}
      </div>
    </ErrorBoundary>
  );
};

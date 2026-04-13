import { LeftOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import type { ListOrderCol, ListOrderDir } from '@/types';
import style from './index.module.css';
import { ProductList } from './ProductList';
import { useCategoryList } from './useCategoryList';

const ModuleName = '_List_';

export const List = () => {
  const navigator = useNavigate();

  const [categroyListContext, { focusedCategoryId, categoryData }] = useCategoryList();

  const [orderCol, setOrderCol] = useState<ListOrderCol>('price'); // 排序类型
  const [orderDir, setOrderDir] = useState<ListOrderDir>('asc'); // 排序方向

  const OrderDirIcon = () =>
    orderDir === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />;

  const onSort = (type: ListOrderCol) => {
    if (orderCol === type) {
      setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderCol(type);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={`${style['default-header-wrapper']} ${style.active}`}>
          <div className={style['default-header']}>
            <LeftOutlined onClick={() => navigator(-1)} />
            <span>{categoryData?.find(item => item.id === focusedCategoryId)?.name || '分类'}</span>
            <Link to="/search">
              <img src="/images/icon_search_darkblack.png" />
            </Link>
          </div>
          {categroyListContext}
        </div>

        <div className={style['order-wrapper']}>
          <span
            className={`${orderCol === 'price' && style.active}`}
            onClick={() => onSort('price')}
          >
            价格
            {orderCol === 'price' && <OrderDirIcon />}
          </span>
          <span className={`${orderCol === 'sale' && style.active}`} onClick={() => onSort('sale')}>
            销量
            {orderCol === 'sale' && <OrderDirIcon />}
          </span>
          <span className={`${orderCol === 'rate' && style.active}`} onClick={() => onSort('rate')}>
            好评
            {orderCol === 'rate' && <OrderDirIcon />}
          </span>
        </div>

        <ProductList
          orderCol={orderCol}
          orderDir={orderDir}
          focusedCategoryId={focusedCategoryId}
        />
      </div>
    </ErrorBoundary>
  );
};

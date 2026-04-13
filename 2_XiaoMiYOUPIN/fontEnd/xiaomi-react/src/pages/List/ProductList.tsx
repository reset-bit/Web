import { List } from 'antd';
import { memo, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useQueryStatus } from '@/hooks';
import { useProductList } from '@/services';
import type { ListOrderCol, ListOrderDir, Product } from '@/types';
import style from './index.module.css';

const PAGE_SIZE = 6;

export const ProductList = memo(
  (props: { orderCol: ListOrderCol; orderDir: ListOrderDir; focusedCategoryId: number | null }) => {
    const { orderCol, orderDir, focusedCategoryId } = props;

    const [products, setProducts] = useState<Product[]>([]); // 商品列表

    const [begin, setBegin] = useState(0); // 滚动加载起始位置索引

    const [operation, setOperation] = useState<'sort' | 'add'>('add'); // 操作类型，用以追加/替换列表

    useEffect(() => {
      setOperation('add');
    }, [begin, focusedCategoryId]);

    useEffect(() => {
      setOperation('sort');
    }, [orderCol, orderDir]);

    const { RenderResult: ProductList, data: productsData } = useQueryStatus({
      result: useProductList({
        name: '',
        cid: focusedCategoryId!,
        orderCol,
        orderDir,
        begin,
        pageSize: PAGE_SIZE,
      }),
      render: (data: Product[]) => (
        <InfiniteScroll
          hasMore={data.length === PAGE_SIZE}
          next={() => setBegin(products.length)}
          dataLength={products.length}
          scrollableTarget="scrollableDiv"
          scrollThreshold="100px"
          loader={<p className={style.tip}>- 加载中 -</p>}
          endMessage={<p className={style.tip}>- 没有更多商品了 -</p>}
        >
          <List
            className={style.list}
            dataSource={products}
            renderItem={(item: Product) => (
              <Link to="/detail" state={{ id: item.id }} key={item.id}>
                <img src={item.avatar} />
                <div className={style['product-detail']}>
                  <h6>{item.name}</h6>
                  <p>{item.brief}</p>
                  <div className={style['price-wrapper']}>
                    ￥<span className={style.price}>{item.price}</span>
                  </div>
                  <div className={style['other-wrapper']}>
                    <span className={style['rate-wrapper']}>
                      <span className={style.rate}>{item.rate}</span>条好评
                    </span>
                    <span className={style['sale-wrapper']}>
                      <span className={style.sale}>{item.sale}</span>件销量
                    </span>
                  </div>
                </div>
              </Link>
            )}
          />
        </InfiniteScroll>
      ),
      options: {
        EmptyElement: () => <p className={style.tip}>- 暂无相关商品，敬请期待 -</p>,
      },
    });

    useEffect(() => {
      if (!productsData) return;
      if (operation === 'sort') {
        // 请求到的商品已在列表中，排序操作
        setProducts(productsData);
      } else {
        // 滚动加载
        setProducts([...products, ...productsData]);
      }
    }, [productsData, operation]);

    return (
      <div className={style['content-wrapper']} id="scrollableDiv">
        <div className={style.content}>
          <ProductList />
        </div>
      </div>
    );
  }
);

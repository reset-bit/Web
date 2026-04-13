import { LeftOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { useQueryStatus } from '@/hooks';
import { useCategory } from '@/services';
import type { Category as CategoryType } from '@/types';
import style from './index.module.css';

const ModuleName = '_Category_';

const EmptyCategory = () => <div className={style.tip}>- 尚未分类，敬请期待 -</div>;

export const Category = () => {
  const fristCategory = useLoaderData() as { key: string; label: string }[];

  const [curSelect, setSelect] = useState('1');
  const { RenderResult: SubCategory } = useQueryStatus({
    result: useCategory(Number(curSelect)),
    render: (data: CategoryType[]) => (
      <ul className={style['list-sub']}>
        {data.map(item => (
          <li key={item.id}>
            <Link to="/list" state={{ fid: item.fid, cid: item.id }}>
              <img src={item.avatar} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    ),
    options: {
      EmptyElement: EmptyCategory,
    },
  });

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={style.header}>
          <LeftOutlined style={{ visibility: 'hidden' }} />
          <span>分类</span>
          <Link to="/search" state={{ cid: Number(curSelect) }}>
            <img src="/images/icon_search_darkblack.png" />
          </Link>
        </div>

        {fristCategory.length > 0 ? (
          <div className={style.content}>
            <div className={style.left}>
              <Tabs
                tabPosition="left"
                indicator={{ size: 0 }}
                activeKey={curSelect}
                items={fristCategory}
                onChange={key => setSelect(key)}
              />
            </div>

            <div className={style.right}>
              <SubCategory />
            </div>
          </div>
        ) : (
          <EmptyCategory />
        )}
      </div>
    </ErrorBoundary>
  );
};

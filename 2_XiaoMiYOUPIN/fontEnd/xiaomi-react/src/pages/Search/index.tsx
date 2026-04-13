import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Carousel, Input } from 'antd';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import style from './index.module.css';

const ModuleName = '_Search_';

const searchHistory = [
  {
    name: '小米电视4A 55英寸',
    id: '1',
  },
  {
    name: '小米电视4C 32英寸',
    id: '2',
  },
  {
    name: 'Redmi 智能电视 X50',
    id: '11',
  },
];
export const Search = () => {
  const navigator = useNavigate();

  const [isFocus, setFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isDefaultSearch = useMemo(() => !isFocus && searchValue === '', [isFocus, searchValue]);

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style['search-module']}`}>
        <div className={style['module-header']}>
          <LeftOutlined onClick={() => navigator(-1)} />
          <div className={style['search-area']}>
            {isDefaultSearch && (
              <>
                <SearchOutlined className={style['icon-search']} />
                <Carousel className={style['search-list-wrapper']} dotPosition="left" autoplay>
                  {searchHistory.map(item => (
                    <span className={style.active} key={item.id}>
                      {item.name}
                    </span>
                  ))}
                </Carousel>
              </>
            )}
            <div className={style['input-wrapper']}>
              <Input
                className={style['module-search']}
                variant="borderless"
                allowClear
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
              />
            </div>
          </div>
          <span className={style['btn-search']}>搜索</span>
        </div>

        <div className={style['module-content-wrapper']}>
          <div className={style['content-title']}>搜索发现</div>
          <div className={style['module-content']}>
            {searchHistory.map(item => (
              <span key={item.id}>
                <Link to="/detail" state={{ id: item.id }}>
                  {item.name}
                </Link>
              </span>
            ))}
          </div>
          <img src="/images/search_avatar.jpg" alt="" />
        </div>
      </div>
    </ErrorBoundary>
  );
};

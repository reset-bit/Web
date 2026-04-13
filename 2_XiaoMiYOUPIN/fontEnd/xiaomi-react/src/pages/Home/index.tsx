import { RightOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ErrorBoundary } from '@/components';
import type { Product } from '@/types';

import 'swiper/swiper-bundle.css';

import style from './index.module.css';

const ModuleName = '_Home_';

type Time = { hour: number; countdown: string };

const products: Product[] = [
  {
    avatar: '/images/product/01.png',
    name: '小米电视4A 55英寸',
    price: 1599,
    id: 1,
  },
  {
    avatar: '/images/product/02.png',
    name: '小米电视4C 32英寸',
    price: 599,
    id: 2,
  },
  {
    avatar: '/images/product/03.png',
    name: '小米电视4A 60英寸',
    price: 1899,
    id: 3,
  },
  {
    avatar: '/images/product/04.png',
    name: '小米电视4C 43英寸',
    price: 999,
    id: 4,
  },
  {
    avatar: '/images/product/05.png',
    name: '小米电视4A 70英寸',
    price: 2999,
    id: 5,
  },
];

export const Home = () => {
  // #region time about
  const [time, setTime] = useState<Time>({ hour: 0, countdown: '' });

  const getTimeEachSecond = useCallback(() => {
    const date = new Date();
    const diff = Math.ceil(
      (new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours() + 1,
        0,
        0
      ).getTime() -
        date.getTime()) /
        1000
    );
    setTime({
      hour: date.getHours() + 1,
      countdown: `00:${String(Math.ceil(diff / 60)).padStart(2, '0')}:${String(Math.floor(diff % 60)).padStart(2, '0')}`,
    });
  }, []);

  useEffect(() => {
    getTimeEachSecond();
    const timer = setInterval(() => {
      if (time.countdown === '00:00:00') {
        clearInterval(timer);
      }
      getTimeEachSecond();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [getTimeEachSecond]);
  // #endregion

  const navigator = useNavigate();

  return (
    <ErrorBoundary>
      <div className={ModuleName}>
        <div className={style.header}>
          <img src="/images/navi_title_v6.png" alt="" />
          <div className={style.search}>
            <i className={`${style.iconfont} ${style['icon-search']}`}></i>
            <input type="text" placeholder="搜一搜" onClick={() => navigator('/search')} />
          </div>
        </div>
        <Swiper
          className={`${style['swiper-container']} ${style.banner}`}
          modules={[Pagination, Autoplay]}
          loop
          autoplay={{ disableOnInteraction: false }}
          pagination={{
            clickable: true,
          }}
        >
          {[
            '/images/banner01.png',
            '/images/banner02.png',
            '/images/banner03.png',
            '/images/banner04.png',
            '/images/banner05.png',
            '/images/banner06.png',
          ].map((item, index) => (
            <SwiperSlide key={index}>
              <img src={item} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={style['btn-nav']}>
          {[
            {
              avatar: '/images/home_btn_new.png',
              name: '上新精选',
            },
            {
              avatar: '/images/home_btn_people.png',
              name: '小米众筹',
            },
            {
              avatar: '/images/home_btn_seckill.png',
              name: '有品秒杀',
            },
            {
              avatar: '/images/home_btn_life.png',
              name: '有品生活+',
            },
            {
              avatar: '/images/home_btn_self.png',
              name: '小米自营',
            },
          ].map((item, index) => (
            <div className={style['btn-wrapper']} key={index}>
              <Link to="">
                <img src={item.avatar} />
                <span>{item.name}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className={style['act-nav']}>
          {[
            '/images/home_act01.png',
            '/images/home_act02.png',
            '/images/home_act03.png',
            '/images/home_act04.png',
          ].map((item, index) => (
            <Link key={index} to="">
              <img src={item} />
            </Link>
          ))}
        </div>

        <div className={style.raise}>
          <div className={style['sub-header']}>
            <span className={style.left}>小米有品众筹</span>
            <span className={style.right}>
              更多
              <RightOutlined />
            </span>
          </div>
          <div className={style['raise-content-wrapper']}>
            <div className={style['raise-content']}>
              <div className={style['raise-item']}>
                <div className={style['item-content']}>
                  <div className={style.left}>
                    <p className={style.name}>电动折叠足浴器D3</p>
                    <span className={style.brief}>
                      无线电动升降，分区精准按摩，亲肤软胶护脚，双重安全保障
                    </span>
                    <p className={style.price}>￥399</p>
                  </div>
                  <div className={style.right}>
                    <img src="/images/home_raise01.png" alt="" />
                  </div>
                </div>
                <div className={style['item-bottom']}>
                  <p>
                    支持人数<span>4586</span>/完成度<span>183%</span>
                  </p>
                  <p className={style['progress-bar']}></p>
                </div>
              </div>
              <div className={`${style['raise-item']} ${style.small}`}>
                <div className={style['item-content']}>
                  <div className={style.left}>
                    <p className={style.name}>臻米西厨机</p>
                    <p className={style.price}>￥899</p>
                  </div>
                  <div className={style.right}>
                    <img src="/images/home_raise02.png" alt="" />
                  </div>
                </div>
                <div className={style['item-bottom']}>
                  <p>
                    支持人数<span>1549</span>
                  </p>
                  <p className={style['progress-bar']}></p>
                </div>
              </div>
              <div className={`${style['raise-item']} ${style.small}`}>
                <div className={style['item-content']}>
                  <div className={style.left}>
                    <p className={style.name}>万里宋境·江源</p>
                    <p className={style.price}>￥199起</p>
                  </div>
                  <div className={style.right}>
                    <img src="/images/home_raise03.png" alt="" />
                  </div>
                </div>
                <div className={style['item-bottom']}>
                  <p>
                    支持人数<span>4389</span>
                  </p>
                  <p className={style['progress-bar']}></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style['new-product']}>
          <div className={style['sub-header']}>
            <span className={style.left}>上新精选</span>
            <span className={style.right}>
              更多
              <RightOutlined />
            </span>
          </div>
          <div className={style['new-product-content']}>
            <ul>
              {products.map(item => (
                <li key={item.id}>
                  <Link to={'/detail'} state={{ id: item.id }}>
                    <img src={item.avatar} alt="" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={style['sec-kill']}>
          <div className={style['sub-header']}>
            <span className={style.left}>
              有品秒杀
              <span className={style['sec-wrapper']}>
                <span className={style.hour}>{time.hour}</span>点场
                <span className={style.sec}>{time.countdown}</span>
              </span>
            </span>
            <span className={style.right}>
              更多
              <RightOutlined />
            </span>
          </div>
          <div className={style['sec-kill-content']}>
            <ul>
              {products.map(item => (
                <li key={item.id}>
                  <Link to={'/detail'} state={{ id: item.id }}>
                    <img src={item.avatar} alt="" />
                    <span>￥{item.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={style.tips}>———— 更多好物，敬请期待 ————</div>
      </div>
    </ErrorBoundary>
  );
};

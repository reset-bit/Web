import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import style from './ListContent.module.styl';
import imagesLoaded from 'imagesloaded';
import IScroll from 'iscroll/build/iscroll-probe';

const ListContent = (props, ref) => {
        const isMounting = useRef(true);// 标识初次渲染，只想要list更新时变化（不标识则初次渲染也会更新）
        const scrollRef = useRef(null);// 保存scroll对象
        const scrollDomRef = useRef();// 保存scroll对应的dom对象
        const isTriggerLoadMoreRef = useRef(false);// 放在state中会触发刷新
        const prevScrollY = useRef();

        const [list, setList] = useState([]);
        const [hasMore, setHasMore] = useState(true);// ref ?
        let tip = '';
        if(hasMore) { tip = '上拉加载更多'; }
        else if(list.length === 0) { tip = '暂无相关商品，敬请期待'; }
        else { tip = '已到达底部'; }

        const updateList = list => {
                setList(list);
                setHasMore(list.length === 6);// 更改加载更多状态
        };
        useImperativeHandle(ref, () => ({ updateList }));
        // iscroll
        const initOrRefreshScroll = () => {
                imagesLoaded(scrollDomRef.current, () => {
                        // 每次render销毁scrollRef，重新new
                        if(scrollRef.current !== null) {
                                scrollRef.current.destroy();
                                scrollRef.current = null;
                        }
                        scrollRef.current = new IScroll(scrollDomRef.current, {
                                decelerate: 0.003,
                                bounce: false,
                                probeType: 2,
                                click: true
                        });
                        scrollRef.current.scrollTo(0, prevScrollY.current);// x,y
                        scrollRef.current.on('scroll', () => {
                                if(!hasMore) return;
                                // 滑到底部
                                isTriggerLoadMoreRef.current = (scrollRef.current.maxScrollY - scrollRef.current.y) === 0;
                        });
                        scrollRef.current.on('scrollEnd', async () => {
                                if(isTriggerLoadMoreRef.current) {// 滑动结束的时候是页面底部
                                        isTriggerLoadMoreRef.current = false;
                                        prevScrollY.current = scrollRef.current.y;
                                        let newList = await props.getList(list.length);
                                        setList([...list, ...newList]);
                                        setHasMore(newList.length === 6);
                                }
                        });

                        // 若iscroll对象不存在则创建，每次判断hasMore状态来执行加载逻辑
                        // 若将hasMore写在依赖数据列表里，则总是闭包到上次的hasMore
                        // if(scrollRef.current === null) {
                        //         scrollRef.current = new IScroll(scrollDomRef.current, {
                        //                 decelerate: 0.003,
                        //                 bounce: false,
                        //                 probeType: 2,
                        //                 click: true
                        //         });
                        //         scrollRef.current.on('scroll', () => {
                        //                 if(!hasMore) return;
                        //                 isTriggerLoadMoreRef.current = (scrollRef.current.maxScrollY - scrollRef.current.y) === 0;
                        //         });
                        //         scrollRef.current.on('scrollEnd', async () => {
                        //                 if(isTriggerLoadMoreRef.current) {
                        //                         isTriggerLoadMoreRef.current = false;
                        //                         let newList = await props.getList(list.length);
                        //                         setList([...list, ...newList]);
                        //                         setHasMore(newList.length === 6);
                        //                 }
                        //         });
                        // } else {
                        //         scrollRef.current.refresh();// 更新滚动区域
                        // }
                });
        };
        // 只在list、hasMore变化时调用，相当实现了nextTick()。setList、setHasMore各渲染一次，性能差
        useEffect(() => {
                if(isMounting.current) return;
                initOrRefreshScroll();
        }, [list, hasMore]);
        useEffect(() => { isMounting.current = false; }, []);// 第一次render执行

        return (
                <div className={style['content']} ref={scrollDomRef}>
                        <div className={style['scroll-wrapper']}>
                                <ul className={style['list']}>
                                        {list.map(item => (
                                                <li key={item.id}>
                                                        <Link to={'/detail/' + item.id}>
                                                                <img src={item.avatar}/>
                                                                <div className={style['right-wrapper']}>
                                                                        <h3>{item.name}</h3>
                                                                        <p>{item.brief}</p>
                                                                        <span className={style['price-wrapper']}>
                                                                        ￥<span className={style['price']}>{item.price}</span>
                                                                </span>
                                                                        <div className={style['other-wrapper']}>
                                                                                <span>{`${item.rate}条评论`}</span> | <span>{`已售出${item.sale}宝贝`}</span>
                                                                        </div>
                                                                </div>
                                                        </Link>
                                                </li>
                                        ))}
                                </ul>
                                <p className={style['tip']}>{tip}</p>
                        </div>
                </div>
        );
};

export default forwardRef(ListContent);
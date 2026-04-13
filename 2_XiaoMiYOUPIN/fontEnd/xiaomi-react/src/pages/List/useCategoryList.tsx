import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryStatus } from '@/hooks';
import { useCategory } from '@/services';
import { useListStore } from '@/store';
import type { Category } from '@/types';
import style from './index.module.css';

export const useCategoryList = (): [
  React.ReactElement,
  { focusedCategoryId: number | null; categoryData: Category[] | undefined },
] => {
  const { state } = useLocation();
  const { focusedCategoryId, setFocusedCategoryId } = useListStore(); // 持久化的分类id

  // 根据路由初始化分类id
  useEffect(() => {
    if (focusedCategoryId !== null) return;
    setFocusedCategoryId(state.cid);
  }, [focusedCategoryId, setFocusedCategoryId, state.cid]);

  const { RenderResult: Category, data: categoryData } = useQueryStatus({
    result: useCategory(state.fid),
    render: (data: Category[]) => (
      <ul className={style.category}>
        {data.map((item: Category) => (
          <li
            className={focusedCategoryId === item.id ? style.active : ''}
            onClick={() => setFocusedCategoryId(item.id)}
            key={item.id}
          >
            <img src={item.avatar} />
            <span className={style.name}>{item.name}</span>
          </li>
        ))}
      </ul>
    ),
  });

  // #region 自动聚焦选中分类为居中
  const categoryWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!categoryWrapperRef.current) return;
    const focusCategoryIndex = categoryData?.findIndex(item => item.id === focusedCategoryId) || 0; // 当前选中分类索引
    const eachCategory = document.querySelector(`.${style.category} > li`); // 分类项DOM
    const eachCategoryWidth =
      (eachCategory?.getBoundingClientRect()?.width || 0) +
      (parseInt(window.getComputedStyle(eachCategory!)?.marginLeft) || 0); // 每个分类项宽度
    // 目标距离 = (当前分类索引 + 0.5) * 分类项宽度 - 容器宽度 / 2
    const targetDistance =
      (focusCategoryIndex + 0.5) * eachCategoryWidth - categoryWrapperRef.current.clientWidth / 2;
    categoryWrapperRef.current?.scroll({ left: targetDistance, behavior: 'smooth' });
  }, [categoryData, focusedCategoryId]);
  // #endregion

  const context = (
    <div className={style['category-wrapper']} ref={categoryWrapperRef}>
      <Category />
    </div>
  );

  return [context, { focusedCategoryId, categoryData }];
};

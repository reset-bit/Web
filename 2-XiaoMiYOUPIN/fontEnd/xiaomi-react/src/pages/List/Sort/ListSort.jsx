import React from 'react';
import style from './ListSort.module.styl';

const ListSort = ({ orderCol, orderDir, changeOrder }) => (
        <div className={style['sort-list']}>
                <span className={`${style[orderCol === 'price' ? 'active' : '']} ${style[orderDir === 'asc' ? 'asc' : 'desc']}`}
                      onClick={() => changeOrder('price')}>价格</span>
                <span className={`${style[orderCol === 'sale' ? 'active' : '']} ${style[orderDir === 'asc' ? 'asc' : 'desc']}`}
                      onClick={() => changeOrder('sale')}>销量</span>
                <span className={`${style[orderCol === 'rate' ? 'active' : '']} ${style[orderDir === 'asc' ? 'asc' : 'desc']}`}
                      onClick={() => changeOrder('rate')}>评价</span>
        </div>
);

export default ListSort;
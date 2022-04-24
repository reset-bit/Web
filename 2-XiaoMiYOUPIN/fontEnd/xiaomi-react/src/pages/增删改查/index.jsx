import React, { Component } from 'react';
import style from './index.module.css';

class List extends Component {
        state = {
                list: [
                        { id: 1, name: 'product-1' },
                        { id: 2, name: 'product-2' },
                        { id: 3, name: 'product-3' }
                ],
                model: {
                        id: 0,
                        name: '',
                        isShow: false
                }
        };
        removeHandler = (id) => {
                if(!window.confirm('delete ?')) return;
                let list = [...this.state.list];
                list.splice(list.findIndex(item => item.id === id), 1);
                this.setState({list});
        };
        beginAddHandler = () => { this.setState({model: {id: 0, name: '', isShow: true}}); };
        beginUpdateHandler = (item) => { this.setState({model: { id: item.id, name: item.name, isShow: true }}); };
        save = () => {
                let {list, model} = this.state;
                if(this.state.model.id === 0) {// add
                        list.push({id: list[list.length - 1].id + 1, name: this.state.model.name});
                } else {// update
                        let newItem = {id: model.id, name: model.name};
                        list.splice(list.findIndex(item => item.id === newItem.id), 1, newItem);
                }
                model.isShow = false;
                this.setState({list, model});
        };
        render() {
                return (
                        <div className='container'>
                                <button className='add' onClick={this.beginAddHandler}>新增</button>
                                <ul>
                                        {this.state.list.map(item => (
                                                <li key={item.id} data-id={item.id}>
                                                        {item.name}
                                                        <button className='remove' onClick={() => this.removeHandler(item.id)}>删除</button>
                                                        <button className='update' onClick={() => this.beginUpdateHandler(item)}>修改</button>
                                                </li>
                                        ))}
                                </ul>
                                <div className={`${style['module']} ${this.state.model.isShow  ? style['show'] : ''}`}>
                                        <label htmlFor="name">product-name</label>
                                        <input type="text" id='name' value={this.state.model.name}
                                               onInput={e => {this.setState({model: {...this.state.model, name: e.target.value}})}}/>
                                        <button onClick={this.save}>save</button>
                                        <button onClick={() => this.setState({model: {...this.state.model, isShow: false}})}>cancel</button>
                                </div>
                        </div>
                );
        }
}

export default List;
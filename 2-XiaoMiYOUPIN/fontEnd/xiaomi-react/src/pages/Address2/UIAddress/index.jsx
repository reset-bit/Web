import React, { Component } from 'react';

class UIAddress extends Component {
        state = {
                model: {
                        id: 0,
                        receiveName: '',
                        receivePhone: '',
                        receiveRegion: '',
                        receiveDetail: ''
                },
                isEdit: false
        };
        beginAdd = () => {
                this.setState({
                        model: {
                                id: 0,
                                receiveName: '',
                                receivePhone: '',
                                receiveRegion: '',
                                receiveDetail: ''
                        },
                        isEdit: true
                });
        };
        beginUpdate = (address) => {
                this.setState({
                        model: {...address},
                        isEdit: true
                });
        };
        save = () => {
                if(this.state.model.id === 0) {
                        this.props.add(this.state.model);
                } else {
                        this.props.update(this.state.model);
                }
                this.setState({ isEdit: false });
        };
        componentDidMount() { this.props.init(); }
        render() {
                return (
                        <div>
                                <ul>
                                        <button onClick={this.beginAdd}>新增</button>
                                        {this.props.list.map(item => (
                                                <li key={item.id}>
                                                        <h1>{item.receiveName}</h1>
                                                        <p>{item.receivePhone}</p>
                                                        <p>{item.receiveRegion} {item.receiveDetail}</p>
                                                        {item.isDefault === 1 ? (
                                                                <span>默认地址</span>
                                                        ) : (
                                                                <button onClick={() =>this.props.setDefault(item.id)}>设为默认地址</button>
                                                        )}
                                                        <button onClick={() => this.beginUpdate(item)}>编辑</button>
                                                        <button onClick={() => this.props.remove(item.id)}>删除</button>
                                                </li>
                                        ))}
                                </ul>
                                <div style={{display: this.state.isEdit ? '' : 'none'}}>
                                        <input type="text" placeholder='收件人姓名' value={this.state.model.receiveName}
                                                onInput={e => this.setState({ model: {...this.state.model, receiveName: e.target.value.trim()} })}/>
                                        <input type="text" placeholder='收件人电话' value={this.state.model.receivePhone}
                                               onInput={e => this.setState({ model: {...this.state.model, receivePhone: e.target.value.trim()} })}/>
                                        <input type="text" placeholder='收件人地区' value={this.state.model.receiveRegion}
                                               onInput={e => this.setState({ model: {...this.state.model, receiveRegion: e.target.value.trim()} })}/>
                                        <input type="text" placeholder='收件人地址' value={this.state.model.receiveDetail}
                                               onInput={e => this.setState({ model: {...this.state.model, receiveDetail: e.target.value.trim()} })}/>
                                        <button onClick={this.save}>确定</button>
                                        <button onClick={() => this.setState({isEdit: false})}>取消</button>
                                </div>
                        </div>
                );
        }
}

export default UIAddress;
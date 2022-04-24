import React, { Component } from 'react';
import AddressEdit from './Edit/AddressEdit.jsx';// 导入容器组件，以便给展示组件提供数据

// 将收到仓库中init后-list/remove/setDefault
class UIAddress extends Component {
        state = { isEdit: false, id: 0 };
        cancel = () => this.setState({isEdit: false});
        componentDidMount = () => this.props.init();
        render() {
                return (
                        <div>
                                <ul>
                                        <button onClick={() => this.setState({isEdit: true, id: 0})}>新增</button>
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
                                                        <button onClick={() => this.setState({isEdit: true, id: item.id})}>编辑</button>
                                                        <button onClick={() => this.props.remove(item.id)}>删除</button>
                                                </li>
                                        ))}
                                </ul>
                                {/* 自定义组件本身没有style属性，使用div包裹或在子组件中style={this.props.style}；修改key值令子组件每次重新渲染 */}
                                {/*<div style={{display: this.state.isEdit ? 'block' : 'none'}}>*/}
                                        {/*<AddressEdit key={new Date().getTime()} cancel={this.cancel} id={this.state.id}/>*/}
                                {/*</div>*/}
                                {/* v-if，逻辑上点击新增/修改之后不能再点击修改/新增 */}
                                {this.state.isEdit && <AddressEdit cancel={this.cancel} id={this.state.id}/>}
                        </div>
                );
        }
}

export default UIAddress;
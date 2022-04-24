import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import style from './Alert.module.styl';
import Dialog from '@/components/Common/Dialog/Dialog.jsx';

// 1-调用时自动创建组件
// 2-调用之前组件已经存在，调用只是显示(this)
class Alert extends Component {
        state = { isShow: false, message: '', title: '' };
        open = (message, title = '提示') => {
                this.setState({ isShow: true, message, title });
        };
        render() {
                return (
                        <Dialog isShow={this.state.isShow}>
                                <h5>{this.state.title}</h5>
                                <p>{this.state.message}</p>
                                <button onClick={() => this.setState({isShow: false})}>确定</button>
                        </Dialog>
                );
        }
}

let alertContainer = document.createElement('div');// 纯dom
document.body.appendChild(alertContainer);
let vNode = React.createElement(Alert, {});// 虚拟dom
let alertInstance = ReactDOM.render(vNode, alertContainer);

export default alertInstance.open;
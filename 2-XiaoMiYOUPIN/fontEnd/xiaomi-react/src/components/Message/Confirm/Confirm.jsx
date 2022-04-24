import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import style from './Confirm.module.styl';
import Dialog from '@/components/Common/Dialog/Dialog.jsx';

class Confirm extends Component {
        state = { isShow: false, message: '', title: '' };
        // 该方法需要返回一个promise对象
        open = (message, title = '提示') => {
                // 标识状态的promise没有必要放在state中：与页面显示无关
                this.promise = new Promise((resolve, reject) => {
                        this.resolve = resolve;// this指代Confirm对象，挂载resolve()到this上，可改变promise状态
                        this.reject = reject;
                });
                this.setState({ isShow: true, message, title });
                return this.promise;
        };
        save = () => {
                this.setState({ isShow: false, title: '' });
                this.resolve();// 相当调用promise.resolve()
        };
        cancel = () => {
                this.setState({ isShow: false, title: '' });
                this.reject();
        };
        render() {
                return (
                        <Dialog isShow={this.state.isShow}>
                                <h5>{this.state.title}</h5>
                                <p>{this.state.message}</p>
                                <button onClick={this.save}>确定</button>
                                <button onClick={this.cancel}>取消</button>
                        </Dialog>
                );
        }
}

let confirmContainer = document.createElement('div');
document.body.appendChild(confirmContainer);
let vNode = React.createElement(Confirm, {});
let confirmInstance = ReactDOM.render(vNode, confirmContainer);

export default confirmInstance.open;
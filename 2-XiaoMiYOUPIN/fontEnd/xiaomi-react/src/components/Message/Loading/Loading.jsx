import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import style from './Loading.module.styl';

class Loading extends Component {
        state = { isShow: false };
        open = () => {
                if(typeof this.count === 'undefined') { this.count = 0; }
                if(this.count === 0) { this.setState({ isShow: true }); }// ori-0，异步更新
                this.count = this.count + 1;
        };
        close = () => {
                this.count = this.count - 1;
                if(this.count === 0) { this.setState({ isShow: false }) }
        };
        render() {
                return (
                        <p className={style['message']} style={{display: this.state.isShow ? 'block' : 'none'}}>loading</p>
                );
        }
}

let loadingContainer = document.createElement('div');
loadingContainer.className = 'loading-container';
document.body.appendChild(loadingContainer);
let vNode = React.createElement(Loading, {});
let loadingInstance = ReactDOM.render(vNode, loadingContainer);

export default {
        open: loadingInstance.open,
        close: loadingInstance.close
};
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import style from './Notice.module.styl';

class Notice extends Component {
        render() {
                let backgroundColor = '#fff';
                switch(this.props.type) {
                        case 'success': backgroundColor = 'green'; break;
                        case 'warning': backgroundColor = 'yellow'; break;
                        case 'error': backgroundColor = 'red'; break;
                }
                return (<p style={{backgroundColor}} className={style['message']}>{this.props.message}</p>);
        }
}

export default (message, type = 'primary') => {
        let noticeContainer = document.createElement('div');
        noticeContainer.className = 'notice-container';
        document.body.appendChild(noticeContainer);
        let vNode = React.createElement(Notice, {message, type});
        let noticeInstance = ReactDom.render(vNode, noticeContainer);
        setTimeout(() => {
                ReactDom.unmountComponentAtNode(noticeContainer);
                document.body.removeChild(noticeContainer);
        }, 2000);
};
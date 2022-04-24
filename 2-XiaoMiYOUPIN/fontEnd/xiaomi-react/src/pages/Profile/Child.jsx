import React, { PureComponent } from 'react';

class Child extends PureComponent {
        // 挂载
        constructor() {
                super();
                console.log('ch-constructor');
        }
        // componentWillMount() { console.log('ch-componentWillMount'); }
        render() {
                console.log('ch-render');
                return (
                        <div>
                                this is child of profile
                        </div>
                );
        }
        componentDidMount() { console.log('ch-componentDisMount'); }
        // 更新
        componentWillReceiveProps() { console.log('ch-componentWillReceiveProps'); }
        // shouldComponentUpdate(nextProps, nextState) {
        //         console.log('ch-shouldComponentUpdate');
        //         let keys = Object.keys(nextProps);
        //         for(let i = 0; i < keys.length; ++i) {
        //                 if(this.props[keys[i]] !== nextProps[key[i]]) return true;
        //         }
        //         if(this.state && nextState) {
        //                 keys = Object.keys(nextState);
        //                 for(let i = 0; i < keys.length; ++i) {
        //                         if(this.state[keys[i]] !== nextState[keys[i]]) return true;
        //                 }
        //         }
        //         return false;
        // }
        // componentWillUpdate() { console.log('ch-componentWillUpdate'); }
        componentDidUpdate() { console.log('ch-componentDidUpdate'); }
        // 卸载
        componentWillUnmount() { console.log('ch-componentWillUnmount'); }
}

export default Child;
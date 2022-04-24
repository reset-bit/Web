import React, { Component } from 'react';
import Child from './Child.jsx';

class Profile extends Component {
        state = {
                a: 10
        };
        changeA = (a) => {this.setState({a});};
        // 挂载
        constructor() {
                super();
                console.log('constructor');
        }
        // componentWillMount() { console.log('componentWillMount'); }
        render() {
                console.log('render');
                return (
                        <div>
                                <p>this is profile component</p>
                                <button onClick={() => this.setState({a: 100})}>changeA by fa-self</button>
                                <hr/>
                                {/*<Child changeA={(a) => this.setState({a})}/>*/}
                                <Child changeA={this.changeA}/>
                        </div>
                );
        }
        componentDidMount() {
                console.log('componentDidMount');
        }
        // 更新
        shouldComponentUpdate() {
                console.log('shouldComponentUpdate');
                return true;
        }
        // componentWillUpdate() { console.log('componentWillUpdate'); }
        getSnapshotBeforeUpdate() {
                console.log('getSnapshotBeforeUpdate');
                return 'hello componentDidUpdate';
        }
        componentDidUpdate(prevProps, prevState, value) { console.log('componentDidUpdate', value); }
        // 卸载
        componentWillUnmount() {
                console.log('componentWillUnmount');
        }
}

export default Profile;
import React, { Component } from 'react';
import style from './index.module.css';
import { Alert, Confirm, Loading, Notice } from '@/components/Message';

class Home extends Component {
        constructor() {
                super();
                this.state = {
                        a: 10,
                        heroes: [
                                { id: 1, name: 'hero-1' },
                                { id: 2, name: 'hero-2' },
                                { id: 3, name: 'hero-3' }
                        ],
                        name: '',
                        score: 65,
                        isShow: true
                };
                this.changeA = this.changeA.bind(this);
        }
        render() {// 初始化或更新时调用
                // let a = 100; // return中不加this.state将访问render内局部变量
                let level = null;
                if(this.state.score >= 90) level = <span>优秀</span>;
                else if(this.state.score >= 80) level = <span>良好</span>;
                else level = <span>及格</span>;
                return (// 返回一个根节点或null
                        <div className={ style['container'] }>
                                this is home page.
                                <span>this is span.</span>
                                <span>{ this.state.a }</span>
                                <button onClick={e => this.changeA(e, 11)}>change value of span</button>
                                <ul>
                                        {this.state.heroes.map(item => (
                                                <li key={item.id}>{item.name}</li>
                                        ))}
                                </ul>
                                <input type="text" value={this.state.name} onInput={e => this.setState({ name: e.target.value })}/>
                                {this.state.score >= 60 && (<span>及格</span>)}
                                {this.state.score >= 60 ? (<span>及格</span>) : (<span>不及格</span>)}
                                {level}
                                <div className={['a', this.state.isShow ? 'show' : ''].join(' ')}>v-show手动控制1</div>
                                <div className={`a ${this.state.isShow ? 'show' : ''}`}>v-show手动控制2</div>

                                <button onClick={() => Alert('today is Saturday')}>test alert</button>
                                <button onClick={async () => {
                                        try {
                                                await Confirm('delete ?');
                                                Alert('delete success');
                                        } catch(e) {}
                                }}>test confirm</button>
                                <button onClick={() => {
                                        Loading.open();
                                        setTimeout(() => Loading.close(), 4000);
                                }}>test loading</button>
                                <button onClick={() => {
                                        Notice('success');
                                }}>test notice</button>
                        </div>
                );
        }
        changeA(e, a) {
                console.log(e.target);
                this.setState({ a });
        }
}

export default Home;
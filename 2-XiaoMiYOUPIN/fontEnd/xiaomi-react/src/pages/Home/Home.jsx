import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import MiNav from '@/components/MiNav';
import { Alert, Confirm, Loading, Notice } from '@/components/Message';
import Child from './Child.jsx';
import Child2 from './Child2.jsx';
import context from './context.js';

const Home = () => {
        return null;

        // hook-useLayoutEffect
        // const divRef = useRef();
        // const [a, setA] = useState(100);
        // useLayoutEffect(() => {
        //         console.log('change margin left');
        //         divRef.current.style.marginLeft = `${a}px`;
        // }, [a]);
        // return (
        //         <div ref={divRef} style={{width: '100px', height: '100px', backgroundColor: 'gray'}}>
        //                 {a}
        //                 <button onClick={() => setA(a + 100)}>change a</button>
        //         </div>
        // );

        // hook-useMemo
        // const [a, setA] = useState(1);
        // const [b, setB] = useState(2);
        // const [c, setC] = useState(3);
        // const sum = useMemo(() => {
        //         console.log('do useMemo');
        //         return a + b;
        // }, [a, b]);
        // return (
        //         <div>
        //                 <span>{sum}</span>
        //                 <button onClick={() => setA(a + 1)}>change a</button>
        //                 <button onClick={() => setB(b + 1)}>change b</button>
        //                 <button onClick={() => setC(c + 1)}>change c</button>
        //         </div>
        // );

        // hook-useRef
        // console.log('render');
        // let inputRef = useRef();
        // let numRef = useRef(1);
        // return (
        //         <div>
        //                 <input ref={inputRef} type="text"/>
        //                 <button onClick={() => inputRef.current.focus()}>get input focus</button>
        //                 <button onClick={() => numRef.current = 100}>change num</button>
        //         </div>
        // );

        // hook-useContext
        // return (
        //         <context.Provider value={{key: 1}}>
        //                 <Child />
        //         </context.Provider>
        // );

        // hook-useEffect
        // const [a, setA] = useState(100);
        // const [b, setB] = useState(10);
        // useEffect(() => {console.log('组件初次渲染完成，发送ajax，任务一执行');}, []);
        // 没有依赖数据，将在页面销毁时执行清除副作用函数
        // useEffect(() => {
        //         let timer = setInterval(() => {console.log(2);}, 1000);
        //         console.log('组件初次渲染完成，开启定时器，每1秒输出2，任务二执行');
        //         return () => {
        //                 clearInterval(timer);
        //                 console.log('任务二收尾工作执行');
        //         };
        // }, []);
        // useEffect(() => {
        //         let timer = setInterval(() => {console.log(3)}, 3000);
        //         console.log('组件初次渲染完成，开启定时器，每3秒输出3，任务三执行');
        //         return () => {
        //                 clearInterval(timer);
        //                 console.log('任务三收尾工作执行');
        //         };
        // }, []);
        // useEffect(() => {console.log('组件首次创建/更新完成，任务四执行');});
        // useEffect(() => {console.log('state.a has changed，任务五执行');}, [a]);
        // useEffect(() => {console.log('state.b has changed，任务六执行');}, [b]);
        // useEffect(() => {console.log('state.a or state.b has changed，任务七执行');}, [a, b]);
        //
        // useEffect(() => {
        //         console.log('state.a has changed');
        //         return () => {
        //                 console.log(document.getElementById('a'));// <span>101</span>
        //                 console.log(a);// 100
        //         };
        // }, [a]);
        // return (
        //         <div>
        //                 this is home.
        //                 <span id='a'>{a}</span>
        //                 <button onClick={() => setA(a+1)}>change a</button>
        //                 <button onClick={() => setB(b+1)}>change b</button>
        //                 <MiNav />
        //         </div>
        // );

        // hook-useCallback
        // console.log('home render');
        // const [a, setA] = useState(100);
        // const [b, setB] = useState(10);
        // const [c, setC] = useState([]);
        // const foo = useCallback(() => {
        //         console.log('foo', b);
        // }, []);
        // return (
        //         <div>
        //                 <button onClick={() => setA(a + 1)}>change a</button>
        //                 <Child b={b} foo={foo}/>
        //                 {/* 每次重新创建obj，故Child2总是刷新。使用lodash避免刷新 */}
        //                 <Child2 obj={{c, setC}}/>
        //         </div>
        // );
};

// 类组件
// class Home extends Component {
//         state = {a:100, b:10};
//         componentDidMount() {
//                 console.log('组件首次创建完成，发送ajax，任务一执行');
//                 this.timer1 = setInterval(() => console.log(2), 1000);
//                 console.log('组件首次创建完成，开启定时器，每1秒输出2，任务二执行');
//                 this.timer2 = setInterval(() => console.log(3), 3000);
//                 console.log('组件首次创建完成，开启定时器，每3秒输出3，任务三执行');
//                 console.log('组件首次创建完成，任务四执行');
//         }
//         componentDidUpdate(prevProps, prevState) {
//                 console.log('组件更新完成，任务四执行');
//                 if(this.state.a !== prevState.a) console.log('组件更新完成，state.a has changed，任务五执行');
//                 if(this.state.b !== prevState.b) console.log('组件更新完成，state.b has changed，任务六执行');
//                 if(this.state.a !== prevState.a || this.state.b !== prevState.b) {
//                         console.log('组件更新完成，state.a or state.b has changed，任务七执行');
//                 }
//         }
//         componentWillUnmount() {
//                 if(this.timer1) {
//                         clearInterval(this.timer1);
//                         console.log('任务二收尾工作完成');
//                 }
//                 if(this.timer2) {
//                         clearInterval(this.timer2);
//                         console.log('任务三收尾工作完成');
//                 }
//         }
//         render() {
//                 return (
//                         <div>
//                                 this is home.
//                                 <button onClick={() => this.setState({a: this.state.a+1})}>change a</button>
//                                 <button onClick={() => this.setState({b: this.state.b+1})}>change b</button>
//                         </div>
//                 );
//         }
// }

// hook-useState
// const Home = () => {
//         let [a, setA] = useState(0);
//         return (
//                 <div>
//                         <p>{a}</p>
//                         <button onClick={() => setA(a + 1)}>a+1</button>
//                         <button onClick={() => setTimeout(() => console.log(a), 3000)}>print a after 3s</button>
//                         <MiNav />
//                 </div>
//         );
// };

export default Home;
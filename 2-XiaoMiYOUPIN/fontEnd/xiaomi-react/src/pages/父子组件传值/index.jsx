import React, { Component } from 'react';
import style from './index.module.css';
import MiNav from '../../components/MiNav';
import Child from './Child.jsx';
import Child2 from './Child2.jsx';
import categoryContext from './categoryContext.js';

class Category extends Component {
        state = {
                valueToChild: 100,
                object: {
                        key1: 'this is obj-key1',
                        key2: 'this is obj-key2'
                }
        };
        changeValue = value => { this.setState({valueToChild: value}) };
        render() {
                return (
                        <div className={ style['container'] }>
                                <p>this is category page.</p>
                                <span>valueToChild: {this.state.valueToChild}</span>
                                <MiNav />
                                <hr/>
                                <categoryContext.Provider value={{a:199}}>
                                        <Child val={this.state.valueToChild} {...this.state.object}
                                               changeValue={this.changeValue}/>
                                </categoryContext.Provider>
                                <hr/>
                                <Child2 />
                        </div>
                );
        }
}

export default Category;
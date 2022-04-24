import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GrandSon from './GrandSon.jsx';
import emitter from './eventEmitter.js';

class Child extends Component {
        // 对接收props的要求-1
        static defaultProps = { b: true };
        static propTypes = {
                val: PropTypes.number.isRequired,
                changeValue: PropTypes.func.isRequired,
                b: PropTypes.bool
        };

        render() {
                return (
                        <div>
                                <div>this is child component.</div>
                                <span>val: {this.props.val}</span>
                                <h1>{this.props.key1}</h1>
                                <span>{this.props.b ? '1' : '0'}</span>
                                <button onClick={() => this.props.changeValue(101)}>change value of father</button>
                                <hr/>
                                <GrandSon/>
                                <button onClick={() => emitter.emit('reHello')}>emit reHello</button>
                        </div>
                );
        }

        componentDidMount() {
                this.helloListener = emitter.addListener('hello', data => {
                        console.log('hello other component, child received message: ' + data);
                });
        }
        componentWillUnmount() {
                emitter.removeListener(this.helloListener);
        }
}
// 对接收props的要求-2
// Child.defaultProps = {};
// Child.propTypes = {};

export default Child;
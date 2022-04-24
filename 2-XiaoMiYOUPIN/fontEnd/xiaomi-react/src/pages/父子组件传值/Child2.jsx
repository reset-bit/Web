import React, { Component } from 'react';
import emitter from './eventEmitter.js';

class Child2 extends Component {
        render() {
                return (
                        <div>
                                <p>this is child2 component</p>
                                <button onClick={() => emitter.emit('hello', 'message-content')}>click me to emit event to child</button>
                        </div>
                );
        }

        componentDidMount() {
                this.reHelloListener = emitter.addListener('reHello', () => {
                        console.log('child2 has received a reHello message');
                });
        }
        componentWillUnmount() {
                emitter.removeListener(this.reHelloListener);
        }
}

export default Child2;
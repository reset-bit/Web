import React, { Component } from 'react';
import categoryContext from './categoryContext.js';

class GrandSon extends Component {
        static contextType = categoryContext;
        render() {
                return (
                        <div>
                                <p>this is grandchild component</p>
                                <span>{this.context.a}</span>
                        </div>
                );
        }
}
// GrandSon.contextType = categoryContext;

export default GrandSon;
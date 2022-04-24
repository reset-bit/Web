import React, { memo, useContext } from 'react';
import context from './context.js';

const Child = () => {
        console.log('child render');
        let value = useContext(context);
        return (
                <div>{value.key}</div>
        );
};
export default memo(Child);
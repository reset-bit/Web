import React, { memo } from 'react';
import _ from 'lodash';

const Child2 = () => {
        console.log('child2 render');
        return null;
};

const isEqual = (prevProps, nextProps) => {
        return _.isEqual(prevProps, nextProps);
};
export default memo(Child2, isEqual);
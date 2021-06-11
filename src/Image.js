import React from 'react';
import PropTypes from 'prop-types';

import { applyPrefix } from './formio/utils';


const Image = ({ src, alt='' }) => {
    return <img class={applyPrefix('image')} src={src} alt={alt} />;
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
};


export default Image;

import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const Image = ({ src, alt='' }) => {
    return <img className={getBEMClassName('image')} src={src} alt={alt} />;
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
};


export default Image;

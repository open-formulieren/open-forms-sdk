import React from 'react';
import PropTypes from 'prop-types';

import { Image as UtrechtImage } from '@utrecht/component-library-react';
import {getBEMClassName} from 'utils';


const Image = ({ src, alt='' }) => {
    return <UtrechtImage className={getBEMClassName('image')} src={src} alt={alt} />;
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
};


export default Image;

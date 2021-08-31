import React from 'react';
import PropTypes from 'prop-types';


const VerticalSpacer = ({ pixels=10 }) => {

  return (
    <div style={{ margin: `${pixels}px 0`}} />
  )
};

VerticalSpacer.propTypes = {
  pixels: PropTypes.number,
};

export default VerticalSpacer;

import React from 'react';
import PropTypes from 'prop-types';


const CoSign = ({ baseUrl, authPlugin='digid-mock' }) => {
  return (
    <>Co-sign: {authPlugin}, {baseUrl}</>
  );
};

CoSign.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  authPlugin: PropTypes.string,
};


export default CoSign;

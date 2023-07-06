import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

export const MODIFIERS = ['centered', 'only-child', 'small'];

const Loader = ({modifiers = []}) => {
  const className = getBEMClassName('loading', modifiers);
  return (
    <div className={className} role="status">
      <span className={getBEMClassName('loading__spinner')} />
    </div>
  );
};

Loader.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(MODIFIERS)),
};

export default Loader;

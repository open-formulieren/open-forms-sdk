import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

const Loader = ({modifiers = []}) => {
  const className = getBEMClassName('loading', modifiers);
  return (
    <div className={className}>
      <span className={getBEMClassName('loading__spinner')} />
    </div>
  );
};

Loader.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['centered', 'only-child', 'small'])),
};

export default Loader;

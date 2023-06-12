import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {ConfigContext} from 'Context';
import {getBEMClassName} from 'utils';

const Wrapper = ({children}) => {
  const {requiredFieldsWithAsterisk} = useContext(ConfigContext);
  return (
    <div
      className={getBEMClassName('form-control', [
        requiredFieldsWithAsterisk ? '' : 'no-asterisks',
      ])}
    >
      {children}
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node,
};

export default Wrapper;

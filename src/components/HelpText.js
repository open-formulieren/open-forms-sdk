import React from 'react';
import PropTypes from 'prop-types';
import { FormFieldDescription } from '@utrecht/component-library-react';
import {getBEMClassName} from 'utils';


const HelpText = ({ children }) => (
  <FormFieldDescription className={getBEMClassName('help-text')}>
    {children}
  </FormFieldDescription>
);

HelpText.propTypes = {
  children: PropTypes.node,
};

export default HelpText;

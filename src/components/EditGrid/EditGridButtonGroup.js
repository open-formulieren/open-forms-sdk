import {ButtonGroup} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

const EditGridButtonGroup = ({children}) => (
  <ButtonGroup className="utrecht-button-group--openforms-editgrid">{children}</ButtonGroup>
);

EditGridButtonGroup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default EditGridButtonGroup;

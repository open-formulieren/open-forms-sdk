import {ButtonGroup} from '@utrecht/button-group-react';
import PropTypes from 'prop-types';

const EditGridButtonGroup = ({children}) => (
  <ButtonGroup className="utrecht-button-group--openforms-editgrid">{children}</ButtonGroup>
);

EditGridButtonGroup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default EditGridButtonGroup;

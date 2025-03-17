import {ButtonGroup} from '@utrecht/button-group-react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';
import FAIcon from 'components/FAIcon';

const DefaultAddButtonLabel = () => (
  <>
    <FAIcon icon="plus" />{' '}
    <FormattedMessage
      description="Edit grid add button, default label text"
      defaultMessage="Add another"
    />
  </>
);

const EditGrid = ({children, onAddItem, addButtonLabel}) => (
  <div className="openforms-editgrid">
    <div>{children}</div>

    {onAddItem && (
      <ButtonGroup>
        <OFButton type="button" appearance="primary-action-button" onClick={onAddItem}>
          {addButtonLabel || <DefaultAddButtonLabel />}
        </OFButton>
      </ButtonGroup>
    )}
  </div>
);

EditGrid.propTypes = {
  children: PropTypes.node.isRequired,
  addButtonLabel: PropTypes.node,
  onAddItem: PropTypes.func,
};

export default EditGrid;

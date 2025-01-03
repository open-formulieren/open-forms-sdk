import {Fieldset, FieldsetLegend} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

const EditGridItem = ({heading, children: body, buttons}) => {
  return (
    <Fieldset className="openforms-editgrid__item">
      <FieldsetLegend className="openforms-editgrid__item-heading">{heading}</FieldsetLegend>
      {body}
      {buttons}
    </Fieldset>
  );
};

EditGridItem.propTypes = {
  heading: PropTypes.node.isRequired,
  children: PropTypes.node,
  buttons: PropTypes.node,
};

export default EditGridItem;

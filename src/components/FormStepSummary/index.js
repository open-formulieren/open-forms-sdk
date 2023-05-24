import PropTypes from 'prop-types';
import React from 'react';
import {useNavigate} from 'react-router-dom';

import Anchor from 'components/Anchor';
import FAIcon from 'components/FAIcon';
import ComponentValueDisplay from 'components/FormStepSummary/ComponentValueDisplay';
import {getBEMClassName} from 'utils';

const LabelValueRow = ({name, value, component}) => {
  if (!name) {
    return null;
  }

  const className = getBEMClassName('summary-row', [component.type]);
  return (
    <div className={className}>
      <div className={getBEMClassName('summary-row__label')}>{name}</div>
      <div className={getBEMClassName('summary-row__value')}>
        <ComponentValueDisplay value={value} component={component} />
      </div>
    </div>
  );
};

LabelValueRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
    PropTypes.bool,
  ]),
  component: PropTypes.object.isRequired,
};

const FormStepSummary = ({slug, name, data, editStepText}) => {
  const editStepUrl = `/stap/${slug}`;
  const navigate = useNavigate();

  return (
    <div className={getBEMClassName('summary')}>
      <div className={getBEMClassName('summary__step-header')}>
        <h2 className={getBEMClassName('summary__step-name')}>{name}</h2>
        <Anchor
          href={editStepUrl}
          onClick={event => {
            event.preventDefault();
            navigate(editStepUrl);
          }}
        >
          <FAIcon icon="pen-to-square" />
          {editStepText}
        </Anchor>
      </div>

      <div className={getBEMClassName('summary__step-data')}>
        {data.map((item, index) => (
          <LabelValueRow
            key={index}
            name={item.name}
            value={item.value}
            component={item.component}
          />
        ))}
      </div>
    </div>
  );
};

FormStepSummary.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  editStepText: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export {LabelValueRow};
export default FormStepSummary;

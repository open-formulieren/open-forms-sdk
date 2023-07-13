import PropTypes from 'prop-types';
import React from 'react';

import FAIcon from 'components/FAIcon';
import ComponentValueDisplay from 'components/FormStepSummary/ComponentValueDisplay';
import Link from 'components/Link';
import {DEBUG} from 'utils';
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
  name: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
    PropTypes.bool,
  ]),
  component: PropTypes.object.isRequired,
};

const FormStepSummary = ({editUrl, slug, name, data, editStepText = ''}) => {
  if (!editUrl) {
    if (DEBUG && !slug) console.error('Provide either a step slug or editUrl prop');
    editUrl = `/stap/${slug}`;
  }

  return (
    <div className={getBEMClassName('summary')}>
      <div className={getBEMClassName('summary__step-header')}>
        <h2 className={getBEMClassName('summary__step-name')}>{name}</h2>

        {editStepText && (
          <Link to={editUrl}>
            <FAIcon icon="pen-to-square" />
            {editStepText}
          </Link>
        )}
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
  name: PropTypes.node.isRequired,
  editUrl: PropTypes.string,
  slug: PropTypes.string,
  editStepText: PropTypes.node,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export {LabelValueRow};
export default FormStepSummary;

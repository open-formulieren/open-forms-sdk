import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import StatementCheckbox from './StatementCheckbox';

const StatementCheckboxes = ({statementsInfo, showWarnings}) => {
  const {values: formikValues} = useFormikContext();

  return (
    <div className="openforms-statement-checkboxes">
      {statementsInfo.map((info, index) => (
        <StatementCheckbox
          key={`${index}-${info.key}`}
          configuration={info}
          showWarning={showWarnings && !formikValues[info.key]}
        />
      ))}
    </div>
  );
};

StatementCheckboxes.propTypes = {
  statementsInfo: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['checkbox']).isRequired,
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      validate: PropTypes.shape({
        required: PropTypes.bool,
      }),
    }).isRequired
  ),
  showWarnings: PropTypes.bool,
};

export default StatementCheckboxes;

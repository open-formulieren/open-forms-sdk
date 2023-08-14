import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import StatementCheckbox from 'components/StatementCheckboxes/StatementCheckbox';

const StatementCheckboxes = ({loading, canSubmit, statementsInfo, showWarnings}) => {
  const {values: formikValues} = useFormikContext();

  if (loading || !canSubmit) return null;

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
  loading: PropTypes.bool,
  canSubmit: PropTypes.bool,
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

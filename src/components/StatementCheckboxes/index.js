import React from 'react';

import StatementCheckbox from 'components/StatementCheckboxes/StatementCheckbox';

const StatementCheckboxes = ({loading, canSubmit, statementsInfo, statementsWarnings}) => {
  if (loading || !canSubmit) return null;

  return (
    <div className="openforms-statement-checkboxes">
      {statementsInfo.map((info, index) => (
        <StatementCheckbox
          key={`${index}-${info.key}`}
          configuration={info}
          showWarning={statementsWarnings[info.key]}
        />
      ))}
    </div>
  );
};

export default StatementCheckboxes;

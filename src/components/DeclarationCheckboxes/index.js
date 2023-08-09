import React from 'react';

import PrivacyCheckbox from 'components/PrivacyCheckbox';

const DeclarationCheckboxes = ({loading, canSubmit, declarationsInfo, declarationsWarnings}) => {
  if (loading || !canSubmit) return null;

  return (
    <div className="openforms-declaration-checkboxes">
      {declarationsInfo.map((info, index) => (
        <PrivacyCheckbox
          key={`${index}-${info.key}`}
          configuration={info}
          showWarning={declarationsWarnings[info.key]}
        />
      ))}
    </div>
  );
};

export default DeclarationCheckboxes;

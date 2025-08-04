import {useFormikContext} from 'formik';

import type {SubmissionStatementConfiguration} from '@/data/forms';

import StatementCheckbox from './StatementCheckbox';

export interface StatementCheckboxesProps {
  statementsInfo: SubmissionStatementConfiguration[];
  showWarnings?: boolean;
}

type FormiKValues = Partial<Record<SubmissionStatementConfiguration['key'], boolean>>;

const StatementCheckboxes: React.FC<StatementCheckboxesProps> = ({
  statementsInfo,
  showWarnings,
}) => {
  const {values: formikValues} = useFormikContext<FormiKValues>();

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

export default StatementCheckboxes;

import {ButtonGroup} from '@utrecht/button-group-react';
import {useFormikContext} from 'formik';
import {useState} from 'react';

import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';
import StatementCheckboxes from 'components/StatementCheckboxes';
import {SUBMISSION_ALLOWED} from 'components/constants';

import {OFButton} from '@/components/Button';
import PreviousLink from '@/components/PreviousLink';
import {SubmissionStatementConfiguration} from '@/data/forms';
import useFormContext from '@/hooks/useFormContext';

const isSubmitEnabled = (
  statementsInfo: SubmissionStatementConfiguration[] = [],
  statementsValues: Record<string, boolean>
): boolean => {
  return statementsInfo.every(info => {
    if (!info.validate?.required) return true;
    return Boolean(statementsValues[info.key]);
  });
};

export interface SummaryConfirmationProps {
  submissionAllowed: 'yes' | 'no_with_overview' | 'no_without_overview';
  prevPage?: string;
  onPrevPage?: (event: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

const SummaryConfirmation: React.FC<SummaryConfirmationProps> = ({
  submissionAllowed,
  prevPage = '',
  onPrevPage,
}) => {
  const {submissionStatementsConfiguration = []} = useFormContext();
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;
  const {values: formikValues} = useFormikContext<Record<string, boolean>>();
  const [showStatementWarnings, setShowStatementWarnings] = useState<boolean>(false);

  const submitDisabled = !isSubmitEnabled(submissionStatementsConfiguration, formikValues);

  return (
    <>
      {canSubmit && (
        <StatementCheckboxes
          statementsInfo={submissionStatementsConfiguration}
          showWarnings={showStatementWarnings}
        />
      )}
      <ButtonGroup className="utrecht-button-group--distanced" direction="column">
        {canSubmit ? (
          <OFButton
            type="submit"
            variant="primary"
            name="confirm"
            disabled={submitDisabled}
            onClick={() => setShowStatementWarnings(true)}
          >
            <Literal name="confirmText" />
            <FAIcon icon="arrow-right-long" />
          </OFButton>
        ) : null}
        {!!onPrevPage && <PreviousLink to={prevPage} onClick={onPrevPage} position="end" />}
      </ButtonGroup>
    </>
  );
};

export default SummaryConfirmation;

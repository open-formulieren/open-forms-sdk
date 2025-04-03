import {useFormikContext} from 'formik';
import {useState} from 'react';

import StatementCheckboxes from 'components/StatementCheckboxes';
import {SUBMISSION_ALLOWED} from 'components/constants';

import {SubmissionStatementConfiguration} from '@/data/forms';
import useFormContext from '@/hooks/useFormContext';

import FormNavigation from '../FormNavigation';

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
  isAuthenticated: boolean;
  onDestroySession?: () => Promise<void>;
  hideAbortButton?: boolean;
}

const SummaryConfirmation: React.FC<SummaryConfirmationProps> = ({
  submissionAllowed,
  prevPage = '',
  onPrevPage,
  isAuthenticated,
  onDestroySession = async () => {},
  hideAbortButton = false,
}) => {
  const {submissionStatementsConfiguration = []} = useFormContext();
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;
  const {values: formikValues} = useFormikContext<Record<string, boolean>>();
  const [showStatementWarnings, setShowStatementWarnings] = useState<boolean>(false);

  const submitEnabled = isSubmitEnabled(submissionStatementsConfiguration, formikValues);

  return (
    <>
      {canSubmit && (
        <StatementCheckboxes
          statementsInfo={submissionStatementsConfiguration}
          showWarnings={showStatementWarnings}
        />
      )}
      <FormNavigation
        canSubmitStep={submitEnabled}
        canSubmitForm={submissionAllowed}
        submitButtonLiteral="confirmText"
        onSubmitClick={() => setShowStatementWarnings(true)}
        canSuspendForm={false}
        isLastStep={false}
        isCheckingLogic={false}
        isAuthenticated={isAuthenticated}
        onDestroySession={onDestroySession}
        hideAbortButton={hideAbortButton}
        previousPage={prevPage}
        onNavigatePrevPage={onPrevPage}
      />
    </>
  );
};

export default SummaryConfirmation;

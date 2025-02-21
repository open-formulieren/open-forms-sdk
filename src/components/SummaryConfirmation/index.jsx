import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {useState} from 'react';

import {OFButton} from 'components/Button';
import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';
import PreviousLink from 'components/PreviousLink';
import StatementCheckboxes from 'components/StatementCheckboxes';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useFormContext from 'hooks/useFormContext';

const isSubmitEnabled = (statementsInfo = [], statementsValues) => {
  return statementsInfo.every(info => {
    if (!info.validate.required) return true;

    return Boolean(statementsValues[info.key]);
  });
};

const SummaryConfirmation = ({submissionAllowed, prevPage, onPrevPage}) => {
  const {submissionStatementsConfiguration = []} = useFormContext();
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;
  const {values: formikValues} = useFormikContext();
  const [showStatementWarnings, setShowStatementWarnings] = useState(false);

  const submitDisabled = !isSubmitEnabled(submissionStatementsConfiguration, formikValues);

  return (
    <>
      {canSubmit && (
        <StatementCheckboxes
          statementsInfo={submissionStatementsConfiguration}
          showWarnings={showStatementWarnings}
        />
      )}
      <Toolbar modifiers={['bottom']}>
        <ToolbarList>
          {canSubmit ? (
            <OFButton
              type="submit"
              appearance="primary-action-button"
              className="openforms-button-with-icon"
              name="confirm"
              disabled={submitDisabled}
              onClick={() => setShowStatementWarnings(true)}
            >
              <Literal name="confirmText" />
              <FAIcon icon="arrow-right-long" />
            </OFButton>
          ) : null}
        </ToolbarList>
        <ToolbarList>
          {!!onPrevPage && <PreviousLink to={prevPage} onClick={onPrevPage} position="end" />}
        </ToolbarList>
      </Toolbar>
    </>
  );
};

SummaryConfirmation.propTypes = {
  submissionAllowed: PropTypes.string.isRequired,
  prevPage: PropTypes.string,
  onPrevPage: PropTypes.func,
};

export default SummaryConfirmation;

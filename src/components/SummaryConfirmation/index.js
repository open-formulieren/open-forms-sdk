import {LinkButton as UtrechtLinkButton} from '@utrecht/component-library-react';
import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import {OFButton} from 'components/Button';
import {Literal} from 'components/Literal';
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

const SummaryConfirmation = ({submissionAllowed, onPrevPage}) => {
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
      <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
        <ToolbarList>
          {!!onPrevPage && (
            <UtrechtLinkButton onClick={onPrevPage} appearance="subtle-button">
              <Literal name="previousText" />
            </UtrechtLinkButton>
          )}
        </ToolbarList>
        <ToolbarList>
          {canSubmit ? (
            <OFButton
              type="submit"
              appearance="primary-action-button"
              name="confirm"
              disabled={submitDisabled}
              onClick={() => setShowStatementWarnings(true)}
            >
              <Literal name="confirmText" />
            </OFButton>
          ) : null}
        </ToolbarList>
      </Toolbar>
    </>
  );
};

SummaryConfirmation.propTypes = {
  submissionAllowed: PropTypes.string.isRequired,
  onPrevPage: PropTypes.func,
};

export default SummaryConfirmation;

import PropTypes from 'prop-types';
import React from 'react';
import {useNavigate} from 'react-router-dom';

import ButtonsToolbar from 'components/ButtonsToolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

const SubmitRow = ({canSubmit, nextText, previousText = '', navigateBackTo = ''}) => {
  const navigate = useNavigate();

  return (
    <ButtonsToolbar
      literals={{
        nextText: {resolved: nextText},
        previousText: {resolved: previousText},
      }}
      canSubmitStep={canSubmit}
      canSubmitForm={SUBMISSION_ALLOWED.yes}
      canSuspendForm={false}
      isAuthenticated={false} // TODO -> if authenticated (for prefill), logout must be shown
      isLastStep={false}
      isCheckingLogic={false}
      loginRequired={false}
      hideAbortButton
      previousPage={navigateBackTo ? `../${navigateBackTo}` : ''}
      onFormSave={() => {}}
      onNavigatePrevPage={navigateBackTo ? () => navigate(`../${navigateBackTo}`) : undefined}
      onDestroySession={() => {}}
    />
  );
};

SubmitRow.propTypes = {
  canSubmit: PropTypes.bool.isRequired,
  nextText: PropTypes.string.isRequired,
  previousText: PropTypes.string,
  navigateBackTo: PropTypes.string,
};

export default SubmitRow;

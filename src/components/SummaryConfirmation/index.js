import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import Button from 'components/Button';
import {Literal} from 'components/Literal';
import PrivacyCheckbox from 'components/PrivacyCheckbox';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

const SummaryConfirmation = ({
  submissionAllowed,
  privacy: {requiresPrivacyConsent, privacyLabel},
  onPrevPage,
}) => {
  const {
    values: {privacy: policyAccepted},
  } = useFormikContext();
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;

  const displayPrivacyNotice = canSubmit && requiresPrivacyConsent;
  const submitDisabled = requiresPrivacyConsent && !policyAccepted;
  const [warningUncheckedPrivacy, setWarningUncheckedPrivacy] = useState(false);
  if (policyAccepted && warningUncheckedPrivacy) {
    setWarningUncheckedPrivacy(false);
  }

  return (
    <>
      {displayPrivacyNotice && (
        <PrivacyCheckbox label={privacyLabel} showWarning={warningUncheckedPrivacy} />
      )}
      <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
        <ToolbarList>
          {!!onPrevPage && (
            <Button variant="anchor" component="a" onClick={onPrevPage}>
              <Literal name="previousText" />
            </Button>
          )}
        </ToolbarList>
        <ToolbarList>
          {canSubmit ? (
            <Button
              type="submit"
              variant="primary"
              name="confirm"
              disabled={submitDisabled}
              onDisabledClick={() => setWarningUncheckedPrivacy(true)}
            >
              <Literal name="confirmText" />
            </Button>
          ) : null}
        </ToolbarList>
      </Toolbar>
    </>
  );
};

SummaryConfirmation.propTypes = {
  submissionAllowed: PropTypes.string.isRequired,
  privacy: PropTypes.shape({
    requiresPrivacyConsent: PropTypes.bool.isRequired,
    privacyLabel: PropTypes.string.isRequired,
  }).isRequired,
  onPrevPage: PropTypes.func,
};

export default SummaryConfirmation;

import PropTypes from 'prop-types';
import React, {useState} from 'react';

import Button from 'components/Button';
import {Literal} from 'components/Literal';
import PrivacyCheckbox from 'components/PrivacyCheckbox';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

const SummaryConfirmation = ({
  submissionAllowed,
  privacy: {requiresPrivacyConsent, policyAccepted, privacyLabel},
  showPreviousPageLink = true,
  onPrivacyCheckboxChange,
  onPrevPage,
}) => {
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;

  const displayPrivacyNotice = canSubmit && requiresPrivacyConsent;
  const submitDisabled = requiresPrivacyConsent && !policyAccepted;
  const [warningUncheckedPrivacy, setWarningUncheckedPrivacy] = useState(false);

  return (
    <>
      {displayPrivacyNotice ? (
        <PrivacyCheckbox
          value={policyAccepted}
          label={privacyLabel}
          warning={warningUncheckedPrivacy}
          onChange={e => {
            setWarningUncheckedPrivacy(false);
            onPrivacyCheckboxChange(e);
          }}
        />
      ) : null}
      <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
        {showPreviousPageLink && (
          <ToolbarList>
            <Button variant="anchor" component="a" onClick={onPrevPage}>
              <Literal name="previousText" />
            </Button>
          </ToolbarList>
        )}
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
    policyAccepted: PropTypes.bool.isRequired,
    privacyLabel: PropTypes.string.isRequired,
  }).isRequired,
  onPrivacyCheckboxChange: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func.isRequired,
};

export default SummaryConfirmation;

import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import Button from 'components/Button';
import {Literal} from 'components/Literal';
import Loader from 'components/Loader';
import PrivacyCheckbox from 'components/PrivacyCheckbox';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

export const PRIVACY_POLICY_ENDPOINT = 'config/privacy_policy_info';

const getPrivacyPolicyInfo = async baseUrl => {
  return await get(`${baseUrl}${PRIVACY_POLICY_ENDPOINT}`);
};

const SummaryConfirmation = ({submissionAllowed, onPrevPage}) => {
  const {baseUrl} = useContext(ConfigContext);
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;

  const {
    loading,
    value: privacyPolicyConfig = {},
    error,
  } = useAsync(async () => {
    if (!canSubmit) return undefined;
    return await getPrivacyPolicyInfo(baseUrl);
  }, [baseUrl, getPrivacyPolicyInfo, canSubmit]);
  if (error) throw error;

  const {requiresPrivacyConsent, privacyLabel} = privacyPolicyConfig;
  const {
    values: {privacy: policyAccepted},
  } = useFormikContext();

  const displayPrivacyNotice = !loading && canSubmit && requiresPrivacyConsent;
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
      {loading && <Loader />}
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
              disabled={loading || submitDisabled}
              onDisabledClick={() => !loading && setWarningUncheckedPrivacy(true)}
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
  onPrevPage: PropTypes.func,
};

export default SummaryConfirmation;

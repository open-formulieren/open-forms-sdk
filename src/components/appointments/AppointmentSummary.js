import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useHistory} from 'react-router-dom';

import Card from 'components/Card';
import {LiteralsProvider} from 'components/Literal';
import SummaryConfirmation from 'components/SummaryConfirmation';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useTitle from 'hooks/useTitle';

const AppointmentSummary = ({form, onConfirm}) => {
  const history = useHistory();
  const onPrevPage = event => {
    event.preventDefault();
    history.push('/appointment');
  };

  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    description: 'Summary page title',
    defaultMessage: 'Check and confirm',
  });
  useTitle(pageTitle);

  const [privacy, setPrivacy] = useState({
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  });

  return (
    <Card
      title={
        <FormattedMessage
          description="Check overview and confirm"
          defaultMessage="Check and confirm"
        />
      }
    >
      <LiteralsProvider literals={form.literals}>
        <form onSubmit={onConfirm}>
          <SummaryConfirmation
            submissionAllowed={SUBMISSION_ALLOWED.yes}
            privacy={privacy}
            onPrivacyCheckboxChange={e =>
              setPrivacy({...privacy, policyAccepted: e.target.checked})
            }
            onPrevPage={onPrevPage}
          />
        </form>
      </LiteralsProvider>
    </Card>
  );
};

export default AppointmentSummary;

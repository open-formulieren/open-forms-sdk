import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {AnalyticsToolsConfigContext} from 'Context';
import {OFButton} from 'components/Button';
import {buildGovMetricUrl} from 'components/analytics/utils';
import useFormContext from 'hooks/useFormContext';

const AbortButton = ({isAuthenticated, onDestroySession}) => {
  const intl = useIntl();
  const analyticsToolsConfig = useContext(AnalyticsToolsConfigContext);
  const form = useFormContext();

  const confirmationMessage = isAuthenticated
    ? intl.formatMessage({
        description: 'log out confirmation prompt',
        defaultMessage: 'Are you sure that you want to logout?',
      })
    : intl.formatMessage({
        description: 'Abort confirmation prompt',
        defaultMessage:
          'Are you sure that you want to abort this submission? You will lose your progress if you continue.',
      });

  const callback = async event => {
    event.preventDefault();

    if (!window.confirm(confirmationMessage)) return;

    await onDestroySession();

    if (analyticsToolsConfig.enableGovmetricAnalytics) {
      const govmetricUrl = buildGovMetricUrl(
        analyticsToolsConfig.govmetricSourceId,
        form.slug,
        analyticsToolsConfig.govmetricSecureGuid
      );

      window.open(govmetricUrl);
    }
  };

  const message = isAuthenticated ? (
    <FormattedMessage description="Log out button text" defaultMessage="Log out" />
  ) : (
    <FormattedMessage
      description="Button label to abort submission"
      defaultMessage="Abort submission"
    />
  );

  if (!isAuthenticated && !analyticsToolsConfig.enableGovmetricAnalytics) return null;

  return (
    <OFButton appearance="primary-action-button" hint="danger" name="abort" onClick={callback}>
      {message}
    </OFButton>
  );
};

AbortButton.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onDestroySession: PropTypes.func.isRequired,
};
export default AbortButton;

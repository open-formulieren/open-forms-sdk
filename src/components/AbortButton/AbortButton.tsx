import {Icon, LinkButton} from '@utrecht/component-library-react';
import {FormattedMessage, useIntl} from 'react-intl';

import FAIcon from 'components/FAIcon';

import {useAnalyticsToolsConfig} from '@/components/analytics/AnalyticsToolConfigProvider';
import {buildGovMetricUrl} from '@/components/analytics/utils';
import useFormContext from '@/hooks/useFormContext';

export interface AbortButtonProps {
  isAuthenticated: boolean;
  onDestroySession: () => Promise<void>;
}

const AbortButton: React.FC<AbortButtonProps> = ({isAuthenticated, onDestroySession}) => {
  const intl = useIntl();
  const analyticsToolsConfig = useAnalyticsToolsConfig();
  const form = useFormContext();

  const confirmationMessage = isAuthenticated
    ? intl.formatMessage({
        description: 'log out confirmation prompt',
        defaultMessage: 'Are you sure that you want to logout?',
      })
    : intl.formatMessage({
        description: 'Cancel confirmation prompt',
        defaultMessage:
          'Are you sure that you want to cancel this submission? You will lose your progress if you continue.',
      });

  const callback = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!window.confirm(confirmationMessage)) return;

    await onDestroySession();

    if (analyticsToolsConfig.enableGovmetricAnalytics) {
      const govmetricUrl = buildGovMetricUrl(
        analyticsToolsConfig.govmetricSourceIdFormAborted,
        form.slug,
        analyticsToolsConfig.govmetricSecureGuidFormAborted
      );

      window.open(govmetricUrl);
    }
  };

  const message = isAuthenticated ? (
    <FormattedMessage description="Log out button text" defaultMessage="Log out" />
  ) : (
    <FormattedMessage
      description="Button label to cancel submission"
      defaultMessage="Cancel submission"
    />
  );

  return (
    <LinkButton name="abort" onClick={callback} className="openforms-abort-button">
      <Icon>
        <FAIcon icon="" className="fa-fw" />
      </Icon>
      {message}
    </LinkButton>
  );
};

export default AbortButton;

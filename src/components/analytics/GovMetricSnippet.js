import {ButtonLink} from '@utrecht/component-library-react';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {AnalyticsToolsConfigContext} from 'Context';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import useFormContext from 'hooks/useFormContext';

import {buildGovMetricUrl} from './utils';

const GovMetricSnippet = () => {
  const analyticsToolsConfig = useContext(AnalyticsToolsConfigContext);
  const form = useFormContext();
  const intl = useIntl();

  if (!analyticsToolsConfig.enableGovmetricAnalytics) return null;

  const govmetricUrl = buildGovMetricUrl(
    analyticsToolsConfig.govmetricSourceId,
    form.slug,
    analyticsToolsConfig.govmetricSecureGuid
  );

  return (
    <Toolbar modifiers={['bottom', 'reverse']}>
      <ToolbarList>
        <ButtonLink
          title={intl.formatMessage({
            description: 'Feedback button title',
            defaultMessage: 'How do you rate this form?',
          })}
          rel="nofollow"
          appearance="primary-action-button"
          href={govmetricUrl}
        >
          <FormattedMessage description="Feedback button label" defaultMessage="Give feedback" />
        </ButtonLink>
      </ToolbarList>
    </Toolbar>
  );
};

export default GovMetricSnippet;

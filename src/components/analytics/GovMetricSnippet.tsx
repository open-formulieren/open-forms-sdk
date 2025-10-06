import {FormattedMessage, useIntl} from 'react-intl';

import useFormContext from '@/hooks/useFormContext';
import govmetricAverageImg from '@/img/govmetric/average.png';
import govmetricGoodImg from '@/img/govmetric/good.png';
import govmetricPoorImg from '@/img/govmetric/poor.png';

import {useAnalyticsToolsConfig} from './AnalyticsToolConfigProvider';
import {buildGovMetricUrl, govMetricURLWithRating} from './utils';

const GovMetricSnippet: React.FC = () => {
  const {enableGovmetricAnalytics, govmetricSourceIdFormFinished, govmetricSecureGuidFormFinished} =
    useAnalyticsToolsConfig();
  const form = useFormContext();
  const intl = useIntl();

  if (!enableGovmetricAnalytics) return null;

  const govmetricUrl = buildGovMetricUrl(
    govmetricSourceIdFormFinished,
    form.slug,
    govmetricSecureGuidFormFinished
  );

  return (
    <div id="sidebar" className="govmetric_snippet gm_sidebar c3">
      <h2>
        <FormattedMessage
          defaultMessage="How do you rate this form?"
          description="GovMetric snippet header"
        />
      </h2>
      <ul className="govmetric_snippet__faces kif_wrap">
        <li className="govmetric_snippet__face kif_col">
          <a
            href={govMetricURLWithRating(govmetricUrl, '3')}
            className="gm_sidebar_anchor"
            title={intl.formatMessage({
              description: 'Feedback face title - Good',
              defaultMessage: "Rate this form as 'Good'",
            })}
            target="_blank"
            rel="nofollow noreferrer"
          >
            <img
              src={govmetricGoodImg}
              width="50px"
              alt={intl.formatMessage({
                description: 'GovMetric green face alt text',
                defaultMessage: 'Green smiley (good)',
              })}
            />
          </a>
          <strong>
            <FormattedMessage defaultMessage="Good" description="GovMetric rating text" />
          </strong>
        </li>
        <li className="govmetric_snippet__face kif_col">
          <a
            href={govMetricURLWithRating(govmetricUrl, '2')}
            className="gm_sidebar_anchor"
            title={intl.formatMessage({
              description: 'Feedback face title - Average',
              defaultMessage: "Rate this form as 'average'",
            })}
            target="_blank"
            rel="nofollow noreferrer"
          >
            <img
              src={govmetricAverageImg}
              width="50px"
              alt={intl.formatMessage({
                description: 'GovMetric orange face alt text',
                defaultMessage: 'Orange smiley (neutral)',
              })}
            />
          </a>
          <strong>
            <FormattedMessage defaultMessage="Average" description="GovMetric rating text" />
          </strong>
        </li>
        <li className="govmetric_snippet__face kif_col">
          <a
            href={govMetricURLWithRating(govmetricUrl, '4')}
            className="gm_sidebar_anchor"
            title="Beoordeel deze formulier als slecht"
            target="_blank"
            rel="nofollow noreferrer"
          >
            <img
              src={govmetricPoorImg}
              width="50px"
              alt={intl.formatMessage({
                description: 'GovMetric red face alt text',
                defaultMessage: 'Red smiley (negative)',
              })}
            />
          </a>
          <strong>
            <FormattedMessage defaultMessage="Bad" description="GovMetric rating text" />
          </strong>
        </li>
      </ul>
    </div>
  );
};

export default GovMetricSnippet;

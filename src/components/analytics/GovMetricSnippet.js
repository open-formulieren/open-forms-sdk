import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {AnalyticsToolsConfigContext} from 'Context';
import useFormContext from 'hooks/useFormContext';

import {buildGovMetricUrl, govMetricURLWithRating} from './utils';

const GovMetricSnippet = () => {
  const {enableGovmetricAnalytics, govmetricSourceIdFormFinished, govmetricSecureGuidFormFinished} =
    useContext(AnalyticsToolsConfigContext);
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
              src="./govmetric/good.png"
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
              src="./govmetric/average.png"
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
              src="./govmetric/poor.png"
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

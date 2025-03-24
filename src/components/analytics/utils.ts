import {GOVMETRIC_URL} from './constants';

const buildGovMetricUrl = (
  govmetricSourceId: string,
  formSlug: string,
  govmetricSecureGuid?: string
): string => {
  const govmetricStopknop = new URL(`/theme/kf/${govmetricSourceId}`, GOVMETRIC_URL);
  govmetricStopknop.searchParams.append('Q_Formid', formSlug);
  if (govmetricSecureGuid) {
    govmetricStopknop.searchParams.append('GUID', govmetricSecureGuid);
  }

  return govmetricStopknop.href;
};

const govMetricURLWithRating = (govMetricUrl: string, ratingId: string): string => {
  const url = new URL(govMetricUrl);
  url.searchParams.append('Q_RATINGID', ratingId);
  return url.href;
};

export {buildGovMetricUrl, govMetricURLWithRating};

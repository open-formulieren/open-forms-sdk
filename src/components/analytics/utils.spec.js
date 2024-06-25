import {buildExpointsUrl, buildGovMetricUrl} from './utils';

describe('Test analytics utils', () => {
  test('Test build URL without GUID', () => {
    const url = buildGovMetricUrl('1234', 'form-slug');

    expect(url).toEqual('https://websurveys2.govmetric.com/theme/kf/1234?Q_Formid=form-slug');
  });

  test('Test build URL with GUID', () => {
    const url = buildGovMetricUrl('1234', 'form-slug', '4321');

    expect(url).toEqual(
      'https://websurveys2.govmetric.com/theme/kf/1234?Q_Formid=form-slug&GUID=4321'
    );
  });

  test('Test build Expoints URL', () => {
    const url = buildExpointsUrl('demodam');

    expect(url).toEqual('https://demodam.expoints.nl');
  });
});

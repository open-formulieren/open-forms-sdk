import {getLoginUrl} from './index';

it('Login URL contains "next" URL with "_start" parameter', () => {
  const loginOption = {
    identifier: 'digid',
    label: 'DigiD',
    url: 'https://openforms.nl/auth/form-name/digid/start',
    logo: {
      title: 'DigiD',
      imageSrc: 'https://openforms.nl/static/img/digid-46x46.71ea68346bbb.png',
      href: 'https://www.digid.nl/',
      appearance: 'dark',
    },
    isForGemachtigde: false,
  };

  // Control the location that the test will use
  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://openforms.nl/form-name/',
  };

  const loginUrl = getLoginUrl(loginOption);

  // Reset location
  window.location = location;

  const parsedUrl = new URL(loginUrl);

  expect(parsedUrl.searchParams.get('next')).toEqual('https://openforms.nl/form-name/?_start=1');
});

it('Login URL does NOT contain "_start" parameter if coSign', () => {
  const loginOption = {
    identifier: 'digid',
    label: 'DigiD',
    url: 'https://openforms.nl/auth/form-name/digid/start',
    logo: {
      title: 'DigiD',
      imageSrc: 'https://openforms.nl/static/img/digid-46x46.71ea68346bbb.png',
      href: 'https://www.digid.nl/',
      appearance: 'dark',
    },
    isForGemachtigde: false,
  };

  // Control the location that the test will use
  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://openforms.nl/form-name/step/step-name',
  };

  const loginUrl = getLoginUrl(loginOption, {coSignSubmission: '11-22-33'});

  // Reset location
  window.location = location;

  const parsedUrl = new URL(loginUrl);

  expect(parsedUrl.searchParams.get('next')).toEqual(
    'https://openforms.nl/form-name/step/step-name'
  );
  expect(parsedUrl.searchParams.get('coSignSubmission')).toEqual('11-22-33');
});

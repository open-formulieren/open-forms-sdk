import {expect, test} from 'vitest';

import type {FormLoginOption} from '@/data/forms';

import {getLoginUrl} from './utils';

test('Login URL contains "next" URL with "_start" parameter', () => {
  const loginOption: FormLoginOption = {
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
    visible: true,
  };

  const loginUrl = getLoginUrl(loginOption);

  const parsedUrl = new URL(loginUrl);
  expect(parsedUrl.searchParams.get('next')).toEqual(`http://${window.location.host}/?_start=1`);
});

test('Login URL does NOT contain "_start" parameter if coSign', () => {
  const loginOption: FormLoginOption = {
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
    visible: true,
  };

  const loginUrl = getLoginUrl(loginOption, {coSignSubmission: '11-22-33'});

  const parsedUrl = new URL(loginUrl);
  expect(parsedUrl.searchParams.get('next')).toEqual(`http://${window.location.host}/`);
  expect(parsedUrl.searchParams.get('coSignSubmission')).toEqual('11-22-33');
});

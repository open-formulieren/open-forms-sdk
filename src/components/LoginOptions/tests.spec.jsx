import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {buildForm} from 'api-mocks';
import {LiteralsProvider} from 'components/Literal';

import LoginOptions from './index';

const Wrapper = ({form, onFormStart}) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <LoginOptions form={form} onFormStart={onFormStart} />,
      },
    ],
    {
      initialEntries: ['/'],
      initialIndex: 0,
    }
  );

  return (
    <IntlProvider locale="nl" messages={messagesNL}>
      <LiteralsProvider literals={{beginText: {resolved: 'Begin Form'}}}>
        <RouterProvider router={router} />
      </LiteralsProvider>
    </IntlProvider>
  );
};

it('Login not required, options wrapped in form tag', async () => {
  const user = userEvent.setup();
  const form = buildForm({loginRequired: false, loginOptions: [], cosignLoginOptions: []});
  const onFormStart = vi.fn(e => e.preventDefault());

  render(<Wrapper form={form} onFormStart={onFormStart} />);

  expect(await screen.findByTestId('start-form')).toBeInTheDocument();

  const anonymousStartButton = screen.getByRole('button', {name: 'Begin Form'});
  expect(anonymousStartButton).toBeVisible();

  await user.click(anonymousStartButton);

  expect(onFormStart).toHaveBeenCalled();
});

it('Login required, options not wrapped in form tag', async () => {
  const form = buildForm({
    loginRequired: true,
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://open-forms.nl/auth/form-slug/digid/start',
        logo: {
          title: 'DigiD simulatie',
          imageSrc: '/digid.png',
          href: 'https://www.digid.nl/',
          appearance: 'light',
        },
        isForGemachtigde: false,
      },
    ],
    cosignLoginOptions: [],
  });
  const onFormStart = vi.fn(e => e.preventDefault());

  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://open-forms.nl/digid-form/',
  };

  render(<Wrapper form={form} onFormStart={onFormStart} />);

  const expectedUrl = new URL(form.loginOptions[0].url);
  expectedUrl.searchParams.set('next', 'https://open-forms.nl/digid-form/?_start=1');

  const digidLoginLink = await screen.findByRole('link', {name: 'Inloggen met DigiD'});
  expect(digidLoginLink).toBeVisible();
  expect(digidLoginLink.href).toEqual(expectedUrl.toString());

  expect(screen.queryByTestId('start-form')).not.toBeInTheDocument();
  expect(screen.queryAllByRole('button')).toHaveLength(0);

  window.location = location;
});

it('Login button has the right URL after cancelling log in', async () => {
  const form = buildForm({
    loginRequired: true,
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://open-forms.nl/auth/form-slug/digid/start',
        logo: {
          title: 'DigiD simulatie',
          imageSrc: '/digid.png',
          href: 'https://www.digid.nl/',
          appearance: 'light',
        },
        isForGemachtigde: false,
      },
    ],
    cosignLoginOptions: [],
  });

  const onFormStart = vi.fn(e => e.preventDefault());

  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://open-forms.nl/digid-form/?_start=1&_digid-message=login-cancelled',
  };

  render(<Wrapper form={form} onFormStart={onFormStart} />);

  const expectedUrl = new URL(form.loginOptions[0].url);
  expectedUrl.searchParams.set('next', 'https://open-forms.nl/digid-form/?_start=1');

  const digidLoginLink = await screen.findByRole('link', {name: 'Inloggen met DigiD'});
  expect(digidLoginLink).toBeVisible();
  expect(digidLoginLink.href).toEqual(expectedUrl.toString());

  window.location = location;
});

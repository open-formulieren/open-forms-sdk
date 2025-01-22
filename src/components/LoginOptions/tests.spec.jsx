import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {buildForm} from 'api-mocks';
import {LiteralsProvider} from 'components/Literal';
import {START_FORM_QUERY_PARAM} from 'components/constants';
import {FUTURE_FLAGS} from 'routes';

import LoginOptions from './index';

const Wrapper = ({form, onFormStart, currentUrl = '/'}) => {
  const parsedUrl = new URL(currentUrl, 'http://dummy');
  const routes = [
    {
      path: parsedUrl.pathname,
      element: <LoginOptions form={form} onFormStart={onFormStart} />,
    },
  ];
  const router = createMemoryRouter(routes, {initialEntries: [currentUrl], future: FUTURE_FLAGS});

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
  const onFormStart = vi.fn();

  render(<Wrapper form={form} onFormStart={onFormStart} />);

  expect(await screen.findByTestId('start-form')).toBeInTheDocument();

  const anonymousStartButton = screen.getByRole('button', {name: 'Begin Form'});
  expect(anonymousStartButton).toBeVisible();

  await user.click(anonymousStartButton);

  expect(onFormStart).toHaveBeenCalledWith({isAnonymous: true});
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
  const onFormStart = vi.fn();

  render(<Wrapper form={form} onFormStart={onFormStart} />);

  const digidLoginLink = await screen.findByRole('link', {name: 'Inloggen met DigiD'});
  expect(digidLoginLink).toBeVisible();
  const loginHref = new URL(digidLoginLink.getAttribute('href'));
  expect(loginHref.origin).toBe('https://open-forms.nl');
  expect(loginHref.pathname).toBe('/auth/form-slug/digid/start');

  const nextUrl = new URL(loginHref.searchParams.get('next'));
  expect(nextUrl.pathname).toBe('/');
  expect(nextUrl.searchParams.get(START_FORM_QUERY_PARAM)).not.toBeNull();

  expect(screen.queryByTestId('start-form')).not.toBeInTheDocument();
  expect(screen.queryAllByRole('button')).toHaveLength(0);
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
  const onFormStart = vi.fn();

  render(
    <Wrapper
      form={form}
      onFormStart={onFormStart}
      currentUrl="/?_start=1&_digid-message=login-cancelled"
    />
  );

  expect(onFormStart).not.toHaveBeenCalled();

  const digidLoginLink = await screen.findByRole('link', {name: 'Inloggen met DigiD'});
  expect(digidLoginLink).toBeVisible();
  const loginHref = new URL(digidLoginLink.getAttribute('href'));
  expect(loginHref.origin).toBe('https://open-forms.nl');
  expect(loginHref.pathname).toBe('/auth/form-slug/digid/start');

  const nextUrl = new URL(loginHref.searchParams.get('next'));
  expect(nextUrl.pathname).toBe('/');
  expect(nextUrl.searchParams.get(START_FORM_QUERY_PARAM)).not.toBeNull();
  expect(nextUrl.searchParams.get('_digid-message')).toBeNull();
});

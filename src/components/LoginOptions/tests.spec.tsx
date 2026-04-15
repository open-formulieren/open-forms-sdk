import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {buildForm} from '@/api-mocks';
import {LiteralsProvider} from '@/components/Literal';
import {START_FORM_QUERY_PARAM} from '@/components/constants';
import type {Form} from '@/data/forms';
import messagesNL from '@/i18n/compiled/nl.json';
import {FUTURE_FLAGS} from '@/routes';

import LoginOptions from './index';

interface WrapperProps {
  form: Form;
  onFormStart: React.ComponentProps<typeof LoginOptions>['onFormStart'];
  currentUrl?: string;
}

const Wrapper: React.FC<WrapperProps> = ({form, onFormStart, currentUrl = '/'}) => {
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

test('Login not required, options wrapped in form tag', async () => {
  const form = buildForm({loginRequired: false, loginOptions: [], cosignLoginOptions: []});
  const onFormStart = vi.fn();

  const screen = await render(<Wrapper form={form} onFormStart={onFormStart} />);

  await expect.element(screen.getByTestId('start-form')).toBeInTheDocument();

  const anonymousStartButton = screen.getByRole('button', {name: 'Begin Form'});
  await expect.element(anonymousStartButton).toBeVisible();

  await anonymousStartButton.click();

  await expect.poll(() => onFormStart).toHaveBeenCalledWith({isAnonymous: true});
});

test('Login required, options not wrapped in form tag', async () => {
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
        visible: true,
      },
    ],
    cosignLoginOptions: [],
  });
  const onFormStart = vi.fn();

  const screen = await render(<Wrapper form={form} onFormStart={onFormStart} />);

  const digidLoginLink = screen.getByRole('link', {name: 'Inloggen met DigiD'});
  await expect.element(digidLoginLink).toBeVisible();
  const loginHref = new URL(digidLoginLink.element().getAttribute('href')!);
  expect(loginHref.origin).toBe('https://open-forms.nl');
  expect(loginHref.pathname).toBe('/auth/form-slug/digid/start');

  const nextUrl = new URL(loginHref.searchParams.get('next')!);
  expect(nextUrl.pathname).toBe('/');
  expect(nextUrl.searchParams.get(START_FORM_QUERY_PARAM)).not.toBeNull();

  await expect.element(screen.getByTestId('start-form')).not.toBeInTheDocument();
  expect(screen.getByRole('button').all()).toHaveLength(0);
});

test('Login button has the right URL after cancelling log in', async () => {
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
        visible: true,
      },
    ],
    cosignLoginOptions: [],
  });
  const onFormStart = vi.fn();

  const screen = await render(
    <Wrapper
      form={form}
      onFormStart={onFormStart}
      currentUrl="/?_start=1&_digid-message=login-cancelled"
    />
  );

  const digidLoginLink = screen.getByRole('link', {name: 'Inloggen met DigiD'});
  await expect.element(digidLoginLink).toBeVisible();
  expect(onFormStart).not.toHaveBeenCalled();

  const loginHref = new URL(digidLoginLink.element().getAttribute('href')!);
  expect(loginHref.origin).toBe('https://open-forms.nl');
  expect(loginHref.pathname).toBe('/auth/form-slug/digid/start');

  const nextUrl = new URL(loginHref.searchParams.get('next')!);
  expect(nextUrl.pathname).toBe('/');
  expect(nextUrl.searchParams.get(START_FORM_QUERY_PARAM)).not.toBeNull();
  expect(nextUrl.searchParams.get('_digid-message')).toBeNull();
});

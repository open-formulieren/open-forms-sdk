import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import FormLandingPage from '@/components/FormLandingPage';
import type {Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';

const INTRODUCTION_CONTENT: string = '<p>Some introduction</p>';
const HELP_CALLOUT_CONTENT: string = '<p>Some help content</p>';

interface WrapperProps {
  form?: Form;
  searchParams?: string;
}

const Wrap: React.FC<WrapperProps> = ({form = buildForm(), searchParams = ''}) => {
  const parsedUrl = new URL('', 'http://dummy');
  const routes = [
    {path: parsedUrl.pathname, element: <FormLandingPage />},
    {path: '/sp', element: '<p>Single page</p>'},
    {path: '/introductie', element: '<p>Introduction page</p>'},
    {path: '/hulp', element: '<p>Help callout page</p>'},
    {path: '/startpagina', element: '<p>Start page</p>'},
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: [''],
    future: FUTURE_FLAGS,
  });
  return (
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        showFormTitle: true,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <NuqsTestingAdapter searchParams={searchParams}>
            <RouterProvider router={router} />
          </NuqsTestingAdapter>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Single step form', async () => {
  const form = buildForm({type: 'single_step'});

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Single page')).toBeVisible();
});

test('With introduction page content', async () => {
  const form = buildForm({introductionPageContent: INTRODUCTION_CONTENT});

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Introduction page')).toBeVisible();
});

test('With help callout page content before start page', async () => {
  const form = buildForm({
    helpCalloutPage: {display: 'before_start_page', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Help callout page')).toBeVisible();
});

test('With help callout page content after start page', async () => {
  const form = buildForm({
    helpCalloutPage: {display: 'after_start_page', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Start page')).toBeVisible();
});

test('Without help callout page content', async () => {
  const form = buildForm({
    helpCalloutPage: {display: 'before_start_page', content: '', image: null},
  });

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Start page')).toBeVisible();
});

test('With help callout page content but never display', async () => {
  const form = buildForm({
    helpCalloutPage: {display: 'never', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Start page')).toBeVisible();
});

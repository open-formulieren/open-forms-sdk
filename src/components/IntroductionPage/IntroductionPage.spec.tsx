import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import IntroductionPage from '@/components/IntroductionPage/index';
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
  const routes = [
    {path: '/introductie', element: <IntroductionPage />},
    {path: '/startpagina', element: '<p>Start page</p>'},
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/introductie'],
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

test('No introduction page content', async () => {
  const form = buildForm({introductionPageContent: ''});

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Start page')).toBeVisible();
});

test('Help callout before start page', async () => {
  const form = buildForm({
    introductionPageContent: INTRODUCTION_CONTENT,
    helpCalloutPage: {display: 'before_start_page', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/hulp`);
});

test('Help callout before start page with query parameter', async () => {
  const form = buildForm({
    introductionPageContent: INTRODUCTION_CONTENT,
    helpCalloutPage: {display: 'before_start_page', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} searchParams="?initial_data_reference=foo" />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/hulp?initial_data_reference=foo`);
});

test('Help callout after start page', async () => {
  const form = buildForm({
    introductionPageContent: INTRODUCTION_CONTENT,
    helpCalloutPage: {display: 'after_start_page', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/startpagina`);
});

test('No content for help callout', async () => {
  const form = buildForm({
    introductionPageContent: INTRODUCTION_CONTENT,
    helpCalloutPage: {display: 'after_start_page', content: '', image: null},
  });

  const screen = await render(<Wrap form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/startpagina`);
});

test('No help callout display', async () => {
  const form = buildForm({
    introductionPageContent: INTRODUCTION_CONTENT,
    helpCalloutPage: {display: 'never', content: HELP_CALLOUT_CONTENT, image: null},
  });

  const screen = await render(<Wrap form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/startpagina`);
});

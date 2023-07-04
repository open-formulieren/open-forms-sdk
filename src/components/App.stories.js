import {expect} from '@storybook/jest';
import {waitForElementToBeRemoved, within} from '@storybook/testing-library';
import {Outlet} from 'react-router-dom';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {buildForm} from 'api-mocks';
import {mockLanguageChoicePut, mockLanguageInfoGet} from 'components/LanguageSelection/mocks';
import {ConfigDecorator} from 'story-utils/decorators';

import App, {getRoutes} from './App';

export default {
  title: 'Private API / App',
  component: App,
  decorators: [ConfigDecorator],
  args: {
    'form.translationEnabled': true,
  },
  argTypes: {
    form: {table: {disable: true}},
  },
  parameters: {
    msw: {
      handlers: [
        mockLanguageInfoGet([
          {code: 'nl', name: 'Nederlands'},
          {code: 'en', name: 'English'},
        ]),
        mockLanguageChoicePut,
      ],
    },
  },
};

const Wrapper = ({form}) => {
  const routes = [
    {
      path: '*',
      element: <App form={form} noDebug />,
      children: getRoutes(form, true),
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0,
  });
  return <RouterProvider router={router} />;
};

const render = args => {
  const form = buildForm({
    translationEnabled: args['form.translationEnabled'],
    explanationTemplate: '<p>Toelichtingssjabloon...</p>',
  });
  return <Wrapper form={form} />;
};

export const Default = {
  render,
};

export const TranslationEnabled = {
  render,
  args: {
    'form.translationEnabled': true,
  },
  play: async ({args, canvasElement}) => {
    const langSelector = await within(canvasElement).findByText(/^nl$/i);
    await expect(langSelector).toBeTruthy();
  },
};

export const TranslationDisabled = {
  render,
  args: {
    'form.translationEnabled': false,
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);

    // wait for spinners to disappear
    const spinners = document.querySelectorAll('.openforms-loading__spinner');
    await Promise.all(Array.from(spinners).map(waitForElementToBeRemoved));

    // assert there's no NL button
    const langSelector = canvas.queryByText(/^nl$/i);
    await expect(langSelector).toBeNull();
  },
};

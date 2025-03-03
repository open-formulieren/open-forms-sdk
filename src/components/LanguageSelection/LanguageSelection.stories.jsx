import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import {getWorker} from 'msw-storybook-addon';
import React from 'react';
import {IntlProvider} from 'react-intl';

import ErrorBoundary from 'components/Errors/ErrorBoundary';
import {I18NContext} from 'i18n';
import {ConfigDecorator} from 'story-utils/decorators';

import {LanguageSelection, LanguageSelectionDisplay} from './index';
import {
  DEFAULT_LANGUAGES,
  mockInvalidLanguageChoicePut,
  mockLanguageChoicePut,
  mockLanguageInfoGet,
} from './mocks';

const I18NDecorator = (Story, {args}) => {
  return (
    <I18NContext.Provider
      value={{
        languageSelectorTarget: null,
        onLanguageChangeDone: args.onLanguageChangeDone,
      }}
    >
      <Story />
    </I18NContext.Provider>
  );
};

const worker = getWorker();

export default {
  title: 'Composites / Language Selection',
  component: LanguageSelection,
  decorators: [I18NDecorator, ConfigDecorator],
  args: {
    onLanguageChangeDone: fn(),
  },
  argTypes: {
    heading: {control: 'text'},
  },
  parameters: {
    msw: {
      handlers: [mockLanguageChoicePut],
    },
  },
};

export const Display = {
  render: args => <LanguageSelectionDisplay {...args} />,
  args: {
    heading: 'Language selection',
    headingLevel: 2,
    headingId: 'heading-id',
    items: [
      {
        lang: 'en',
        textContent: 'EN',
        label: 'English',
        current: true,
      },
      {
        lang: 'nl',
        textContent: 'NL',
        label: 'Nederlands',
        current: false,
      },
      {
        lang: 'fy',
        textContent: 'FY',
        label: 'frysk',
        current: false,
      },
    ],
    onLanguageChange: fn(),
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText(/^fy$/i));
    await expect(args.onLanguageChange).toHaveBeenCalled();
  },
};

const render = ({languages, wrapInErrorBoundary, ...args}) => {
  worker.use(mockLanguageInfoGet(languages));
  const Wrapper = wrapInErrorBoundary ? ErrorBoundary : React.Fragment;
  return (
    <IntlProvider messages={{}} locale={'nl'} defaultLocale="nl">
      <Wrapper>
        <LanguageSelection {...args} />
      </Wrapper>
    </IntlProvider>
  );
};

const functionalArgTypes = {
  onLanguageChangeDone: {
    table: {disable: true},
  },
};

export const Functional = {
  render,
  args: {
    wrapInErrorBoundary: false,
    languages: DEFAULT_LANGUAGES,
    onLanguageChange: fn(),
  },
  argTypes: functionalArgTypes,
  parameters: {
    controls: {expanded: true},
    docs: {
      argTypes: {
        exclude: ['wrapInErrorBoundary', 'languages'],
      },
    },
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);
    // wait for api info call to return
    let frysk_button = await waitFor(() => canvas.findByText(/^fy$/i));
    window.confirm = () => true;
    await userEvent.click(frysk_button);
    // wait for PUT api call to have completed and loading state to be resolved
    await waitFor(() => canvas.findByText(/^fy$/i));
    // change once
    await waitFor(() => {
      expect(args.onLanguageChangeDone).toHaveBeenCalled();
    });
    expect(args.onLanguageChangeDone).toHaveBeenCalledTimes(1);
  },
};

export const UnavailableLanguage = {
  name: 'Unavailable language',
  render,
  args: {
    wrapInErrorBoundary: true,
    languages: DEFAULT_LANGUAGES,
    onLanguageChange: fn(),
  },
  argTypes: {
    ...functionalArgTypes,
    heading: {table: {disable: true}},
    headingLevel: {table: {disable: true}},
  },
  parameters: {
    msw: {
      handlers: [mockInvalidLanguageChoicePut('fy')],
    },
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);
    const frysk_button = await waitFor(() => canvas.findByText(/^fy$/i)); // wait for api info call to return
    await userEvent.click(frysk_button);
    expect(await canvas.findByRole('alert')).toBeVisible();
    expect(args.onLanguageChangeDone).toHaveBeenCalledTimes(0); // did not change language
  },
};

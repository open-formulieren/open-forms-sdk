import type {Decorator, Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import {getWorker} from 'msw-storybook-addon';
import React from 'react';
import {IntlProvider} from 'react-intl';

import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import type {I18NContextType} from '@/i18n';
import {I18NContext} from '@/i18n';

import LanguageSelection, {type LanguageInfo} from './LanguageSelection';
import {
  DEFAULT_LANGUAGES,
  mockInvalidLanguageChoicePut,
  mockLanguageChoicePut,
  mockLanguageInfoGet,
} from './mocks';

const worker = getWorker();

interface Args extends I18NContextType {
  wrapInErrorBoundary?: boolean;
  languages: LanguageInfo['languages'];
}

const I18NDecorator: Decorator<Args> = (
  Story,
  {args: {languages, wrapInErrorBoundary, ...args}}
) => {
  worker.use(mockLanguageInfoGet(languages));
  const Wrapper = wrapInErrorBoundary ? ErrorBoundary : React.Fragment;
  return (
    <I18NContext.Provider value={{...args}}>
      <IntlProvider messages={{}} locale={'nl'} defaultLocale="nl">
        <Wrapper>
          <Story />
        </Wrapper>
      </IntlProvider>
    </I18NContext.Provider>
  );
};

export default {
  title: 'Composites / Language Selection',
  component: LanguageSelection,
  decorators: [I18NDecorator],
  args: {
    onLanguageChangeDone: fn(),
    languageSelectorTarget: null,
    languages: DEFAULT_LANGUAGES,
  },
  parameters: {
    docs: {
      argTypes: {
        exclude: ['wrapInErrorBoundary', 'languages'],
      },
    },
    msw: {
      handlers: [mockLanguageChoicePut],
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Functional: Story = {
  args: {
    wrapInErrorBoundary: false,
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);
    // wait for api info call to return
    const frysk_button = await canvas.findByText(/^fy$/i);
    expect(frysk_button).toBeVisible();
    window.confirm = () => true;
    await userEvent.click(frysk_button);
    // wait for PUT api call to have completed and loading state to be resolved
    await canvas.findByText(/^fy$/i);
    // change once
    await waitFor(() => {
      expect(args.onLanguageChangeDone).toHaveBeenCalled();
    });
    expect(args.onLanguageChangeDone).toHaveBeenCalledTimes(1);
  },
};

export const UnavailableLanguage: Story = {
  name: 'Unavailable language',
  args: {
    wrapInErrorBoundary: true,
  },
  parameters: {
    msw: {
      handlers: [mockInvalidLanguageChoicePut('fy')],
    },
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);

    // wait for api info call to return
    const frysk_button = await canvas.findByText(/^fy$/i);
    expect(frysk_button).toBeVisible();

    await userEvent.click(frysk_button);
    expect(await canvas.findByRole('alert')).toBeVisible();
    expect(args.onLanguageChangeDone).toHaveBeenCalledTimes(0); // did not change language
  },
};

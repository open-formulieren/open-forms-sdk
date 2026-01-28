import type {SupportedLocales} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {useIntl} from 'react-intl';
import {fn} from 'storybook/test';

import {
  mockFormioTranslations,
  mockFormioTranslationsServiceUnavailable,
} from '@/components/LanguageSelection/mocks';
import {I18NErrorBoundary, I18NManager, setLanguage} from '@/i18n';

import {mockCustomStaticTranslationsNullGet} from './api-mocks';

export default {
  title: 'Private API / Translation manager',
  component: I18NManager,
  args: {
    languageSelectorTarget: null,
    onLanguageChangeDone: fn(),
  },
  parameters: {
    msw: {handlers: [mockFormioTranslations]},
    controls: {hideNoControlsWarning: true},
  },
  argTypes: {
    languageSelectorTarget: {table: {disable: true}},
    children: {table: {disable: true}},
    onLanguageChangeDone: {table: {disable: true}},
  },
} satisfies Meta<typeof I18NManager>;

type Story = StoryObj<typeof I18NManager>;

const Debug: React.FC = () => {
  const {locale} = useIntl();
  return (
    <>
      <div>Current locale: {locale}</div>
      <div>
        Change locale to:
        <select
          value={locale}
          onChange={event => setLanguage(event.target.value as SupportedLocales)}
        >
          <option value="nl">nl</option>
          <option value="en">en</option>
        </select>
      </div>
    </>
  );
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        mockFormioTranslations,
        mockCustomStaticTranslationsNullGet('en'),
        mockCustomStaticTranslationsNullGet('nl'),
      ],
    },
  },
  render: args => (
    <I18NManager {...args}>
      <Debug />
    </I18NManager>
  ),
};

export const WithError: Story = {
  name: 'Error loading assets',
  render: args => (
    <I18NErrorBoundary>
      <I18NManager {...args}>
        <Debug />
      </I18NManager>
    </I18NErrorBoundary>
  ),
  parameters: {
    msw: {handlers: [mockFormioTranslationsServiceUnavailable]},
  },
};

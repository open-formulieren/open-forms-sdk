import {useIntl} from 'react-intl';

import {
  mockFormioTranslations,
  mockFormioTranslationsServiceUnavailable,
} from 'components/LanguageSelection/mocks';
import {I18NErrorBoundary, I18NManager, setLanguage} from 'i18n';
import {ConfigDecorator} from 'story-utils/decorators';

export default {
  title: 'Private API / Translation manager',
  component: I18NManager,
  decorators: [ConfigDecorator],
  parameters: {
    msw: {handlers: [mockFormioTranslations]},
    controls: {hideNoControlsWarning: true},
  },
  argTypes: {
    languageSelectorTarget: {table: {disable: true}},
    children: {table: {disable: true}},
    onLanguageChangeDone: {table: {disable: true}},
  },
};

const Debug = () => {
  const {locale} = useIntl();
  return (
    <>
      <div>Current locale: {locale}</div>
      <div>
        Change locale to:
        <select value={locale} onChange={event => setLanguage(event.target.value)}>
          <option value="nl">nl</option>
          <option value="en">en</option>
        </select>
      </div>
    </>
  );
};

export const Default = {
  render: () => (
    <I18NManager languageSelectorTarget={null}>
      <Debug />
    </I18NManager>
  ),
};

export const WithError = {
  name: 'Error loading assets',
  render: () => (
    <I18NErrorBoundary>
      <I18NManager languageSelectorTarget={null}>
        <Debug />
      </I18NManager>
    </I18NErrorBoundary>
  ),
  parameters: {
    msw: {handlers: [mockFormioTranslationsServiceUnavailable]},
  },
};

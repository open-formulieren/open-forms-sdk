import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { createGlobalstate, useGlobalState } from 'state-pool';
import {useAsync} from 'react-use';
import { IntlProvider } from 'react-intl';

// ensure flatpickr locales are included in bundle
import "flatpickr/dist/l10n/nl.js";

import { get } from 'api';
import Loader from 'components/Loader';
import {ConfigContext, FormioTranslations} from 'Context';

import messagesNL from './i18n/compiled/nl.json';
import messagesEN from './i18n/compiled/en.json';

const currentLanguage = createGlobalstate('nl');

const setLanguage = (langCode) => {
  currentLanguage.setValue(langCode);
};

const loadLocaleData = (locale) => {
    switch (locale) {
        case 'nl':
            return messagesNL;
        default:
            return messagesEN;
    }
};

// TODO: add language code argument!
const loadFormioTranslations = async (baseUrl) => {
  return get(`${baseUrl}translations/formio`);
};


const I18NContext = React.createContext({
  onLanguageChangeDone: () => {},
  languageSelectorTarget: null,
});
I18NContext.displayName = 'I18NContext';


const I18NManager = ({ languageSelectorTarget, children }) => {
  const {baseUrl} = useContext(ConfigContext);
  const [languageCode] = useGlobalState(currentLanguage);

  // ensure that we load the translations for the requested language
  const {loading, value, error} = useAsync(
    async () => {
      const promises = [
        loadLocaleData(languageCode),
        loadFormioTranslations(baseUrl),
      ];
      const [messages, formioTranslations] = await Promise.all(promises);
      return {
        messages,
        formioTranslations,
      };
    },
    [baseUrl, languageCode]
  );

  if (loading) return (
    <Loader modifiers={['centered']} />
  );

  if (error) {
    // TODO
    throw error;
  }

  const {messages, formioTranslations} = value;

  const onLanguageChangeDone = (newLanguageCode) => {
    console.log(`Changed language to: ${newLanguageCode}`);
  }

  return (
    <IntlProvider messages={messages} locale={languageCode} defaultLocale="nl">
      <FormioTranslations.Provider value={{i18n: formioTranslations, language: languageCode}}>
        <I18NContext.Provider value={{languageSelectorTarget, onLanguageChangeDone}}>
          {children}
        </I18NContext.Provider>
      </FormioTranslations.Provider>
    </IntlProvider>
  );
};

I18NManager.propTypes = {
  languageSelectorTarget: PropTypes.instanceOf(Element),
  children: PropTypes.node,
}


export {
  setLanguage,
  I18NManager,
  I18NContext,
};

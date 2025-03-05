import flatpickr from 'flatpickr';
import {Dutch} from 'flatpickr/dist/l10n/nl.js';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {IntlProvider, createIntl, createIntlCache} from 'react-intl';
import {useAsync} from 'react-use';
import {createState, useState as useGlobalState} from 'state-pool';

import {ConfigContext, FormioTranslations} from 'Context';
import {get} from 'api';
import {logError} from 'components/Errors/ErrorBoundary';
import ErrorMessage from 'components/Errors/ErrorMessage';
import Loader from 'components/Loader';

// ensure flatpickr locales are included in bundle
flatpickr.l10ns.nl = Dutch;

const currentLanguage = createState('nl');

const setLanguage = langCode => {
  currentLanguage.setValue(langCode);
};

const loadLocaleData = async locale => {
  let localeToLoad;
  switch (locale) {
    case 'nl': {
      localeToLoad = 'nl';
      break;
    }
    case 'en':
    // in case (accidentally) a locale is set that we don't ship translations for yet,
    // fall back to English.
    // eslint-disable-next-line no-fallthrough
    default: {
      localeToLoad = 'en';
    }
  }
  const messages = await import(`./i18n/compiled/${localeToLoad}.json`);
  return messages.default;
};

/*
Functionality to localize messages in a locale outside of the usual React lifecycle.
 */
const cache = createIntlCache();

const formatMessageForLocale = async (locale, msg) => {
  const messages = await loadLocaleData(locale);
  const intl = createIntl({locale, messages}, cache);
  return intl.formatMessage(msg);
};

const loadFormioTranslations = async (baseUrl, languageCode) => {
  const messages = await get(`${baseUrl}i18n/formio/${languageCode}`);
  return {[languageCode]: messages};
};

const I18NContext = React.createContext({
  onLanguageChangeDone: () => {},
  languageSelectorTarget: null,
});
I18NContext.displayName = 'I18NContext';

const I18NManager = ({languageSelectorTarget, onLanguageChangeDone, children}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [languageCode] = useGlobalState(currentLanguage);

  // ensure that we load the translations for the requested language
  const {loading, value, error} = useAsync(async () => {
    const promises = [loadLocaleData(languageCode), loadFormioTranslations(baseUrl, languageCode)];
    const [messages, formioTranslations] = await Promise.all(promises);
    return {
      messages,
      formioTranslations,
    };
  }, [baseUrl, languageCode]);

  if (loading) return <Loader modifiers={['centered']} withoutTranslation />;

  if (error) {
    throw error;
  }

  const {messages, formioTranslations} = value;

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
  onLanguageChangeDone: PropTypes.func,
  children: PropTypes.node,
};

/**
 * Special error boundary that doesn't use react-intl anywhere.
 *
 * Usually you'd want to use 'components/ErrorBoundary', but those boundaries
 * typically rely on an IntlProvider being active without problems. If we have errors
 * in our I18NManager component, this is not the case, so we need to use a generic
 * error boundary.
 */
class I18NErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    const {children} = this.props;
    const {hasError, error} = this.state;
    if (!hasError) {
      return children;
    }

    const defaultMsg = `
      Er ging helaas iets fout. Neem a.u.b. contact op met de
      helpdesk en informeer hen van dit probleem.
    `;
    return (
      <ErrorMessage>
        <div>{defaultMsg}</div>
        {error.detail ? (
          <p>
            Fout: <em>{error.detail}</em>
          </p>
        ) : null}
      </ErrorMessage>
    );
  }
}

export {setLanguage, formatMessageForLocale, I18NManager, I18NContext, I18NErrorBoundary};

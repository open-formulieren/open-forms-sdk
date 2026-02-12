import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import type {SupportedLocales} from '@open-formulieren/types';
import flatpickr from 'flatpickr';
import {Dutch} from 'flatpickr/dist/l10n/nl.js';
import React, {useContext} from 'react';
import {
  IntlProvider,
  type MessageDescriptor,
  type MessageFormatElement,
  createIntl,
  createIntlCache,
} from 'react-intl';
import {useAsync} from 'react-use';
import {createState, useState as useGlobalState} from 'state-pool';

import {ConfigContext, FormioTranslations} from '@/Context';
import {get} from '@/api';
import {logError} from '@/components/Errors';
import type {ErrorBoundaryState} from '@/components/Errors/ErrorBoundary';
import ErrorMessage from '@/components/Errors/ErrorMessage';

// ensure flatpickr locales are included in bundle
flatpickr.l10ns.nl = Dutch;

const currentLanguage = createState<SupportedLocales>('nl');

const setLanguage = (langCode: SupportedLocales) => {
  currentLanguage.setValue(langCode);
};

export type ReactIntlLocaleData = Record<string, MessageFormatElement[]>;

const loadLocaleData = async (
  baseUrl: string,
  locale: SupportedLocales
): Promise<ReactIntlLocaleData> => {
  let localeToLoad: SupportedLocales;
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

  const [originalMessages, customizedMessages] = await Promise.all<
    [Promise<{default: ReactIntlLocaleData}>, Promise<ReactIntlLocaleData | null>]
  >([
    import(`./i18n/compiled/${localeToLoad}.json`),
    get<ReactIntlLocaleData | null>(`${baseUrl}i18n/compiled-messages/${localeToLoad}.json`),
  ]);

  const mergedMessages: ReactIntlLocaleData = {
    ...originalMessages.default,
    ...(customizedMessages ?? {}),
  };

  return mergedMessages;
};

/*
Functionality to localize messages in a locale outside of the usual React lifecycle.
 */
const cache = createIntlCache();

const formatMessageForLocale = async (
  baseUrl: string,
  locale: SupportedLocales,
  msg: MessageDescriptor
) => {
  const messages = await loadLocaleData(baseUrl, locale);
  const intl = createIntl({locale, messages}, cache);
  return intl.formatMessage(msg);
};

export type FormioTranslations = Record<SupportedLocales, Record<string, string>>;

const loadFormioTranslations = async (
  baseUrl: string,
  languageCode: SupportedLocales
): Promise<Partial<FormioTranslations>> => {
  const messages = await get(`${baseUrl}i18n/formio/${languageCode}`);
  return {[languageCode]: messages};
};

export interface I18NContextType {
  onLanguageChangeDone: (newLanguageCode: SupportedLocales) => void;
  languageSelectorTarget: HTMLElement | null;
}

const I18NContext = React.createContext<I18NContextType>({
  onLanguageChangeDone: () => {},
  languageSelectorTarget: null,
});
I18NContext.displayName = 'I18NContext';

export interface I18NManagerProps {
  languageSelectorTarget: HTMLElement | null;
  onLanguageChangeDone: I18NContextType['onLanguageChangeDone'];
  children: React.ReactNode;
}

const I18NManager: React.FC<I18NManagerProps> = ({
  languageSelectorTarget,
  onLanguageChangeDone,
  children,
}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [languageCode] = useGlobalState(currentLanguage);

  // ensure that we load the translations for the requested language
  const {loading, value, error} = useAsync(async () => {
    const promises: [Promise<ReactIntlLocaleData>, Promise<Partial<FormioTranslations>>] = [
      loadLocaleData(baseUrl, languageCode),
      loadFormioTranslations(baseUrl, languageCode),
    ];
    const [messages, formioTranslations] = await Promise.all(promises);
    return {
      messages,
      formioTranslations,
    };
  }, [baseUrl, languageCode]);

  if (loading) {
    // the description is *deliberately* not localized
    return <LoadingIndicator position="center" description="Loading..." />;
  }
  if (error) {
    throw error;
  }

  const {messages, formioTranslations} = value!; // no error, not loading -> value is not undefined

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

interface I18NErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Special error boundary that doesn't use react-intl anywhere.
 *
 * Usually you'd want to use 'components/ErrorBoundary', but those boundaries
 * typically rely on an IntlProvider being active without problems. If we have errors
 * in our I18NManager component, this is not the case, so we need to use a generic
 * error boundary.
 */
class I18NErrorBoundary extends React.Component<I18NErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  public render() {
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
        {typeof error === 'object' && 'detail' in error && (
          <p>
            Fout: <em>{error.detail}</em>
          </p>
        )}
      </ErrorMessage>
    );
  }
}

export {setLanguage, formatMessageForLocale, I18NManager, I18NContext, I18NErrorBoundary};

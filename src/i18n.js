import React, { useState } from "react";
import { useAsync } from "react-use";
import { IntlProvider } from "react-intl";

import App from "components/App";
import Loader from "components/Loader";

import { get, post } from "api";
import { ConfigContext, FormioTranslations } from "Context";

import messagesNL from "./i18n/compiled/nl.json";
import messagesEN from "./i18n/compiled/en.json";

const loadLocaleData = (locale) => {
  switch (locale) {
    case "nl":
      return messagesNL;
    default:
      return messagesEN;
  }
};

const loadFormioTranslations = async (baseUrl) => {
  return get(`${baseUrl}translations/formio`);
};

/**
 * A form language manager.
 *
 * Component concerned with managing the active language of a form
 * it's responsible for (re-)loading all i18n strings a form may need.
 *
 * @param {string} initialLang - Initially requested default language
 * @param {string} baseUrl - Open Forms API base URL
 * @param {string} basePath - Base path of the form router
 * @param {HTMLElement=} languageSelectorTarget - (optional) Element to render the LanaguageSelector in
 * @return {JSX} - App with required context
 */
const I18NManager = ({
  initialLang,
  baseUrl,
  basePath,
  languageSelectorTarget,
  formUrl,
}) => {
  const [lang, setLang] = useState(initialLang);

  const loadForm = async (formUrl) => {
    const formInfo = await get(formUrl);
    if (!formInfo.translationEnabled) {
      // force the default form language
      const { activeLanguage } = await post(
        `${formInfo.url}/activate_default_language`
      );
      // trigger reload if needed
      setLang(activeLanguage);
    }
    return formInfo;
  };

  const { loading, value, error } = useAsync(async () => {
    // Optimistically start loading strings
    const [formInfo, messages, translations] = await Promise.all([
      loadForm(formUrl), //but start form load first; it might trigger a reload
      loadLocaleData(lang),
      loadFormioTranslations(baseUrl),
    ]);
    return [formInfo, messages, translations];
  }, [lang, baseUrl, formUrl]);

  if (loading) return <Loader />;
  if (error) throw error;
  // Clear to unpack all promises
  const [formInfo, messages, translations] = value;

  return (
    <ConfigContext.Provider
      value={{
        baseUrl: baseUrl,
        basePath: basePath,
        onLanguageChanged: setLang,
      }}
    >
      <IntlProvider messages={messages} locale={lang} defaultLocale="nl">
        <FormioTranslations.Provider
          value={{ i18n: translations, language: lang }}
        >
          <App
            languageSelectorTarget={languageSelectorTarget}
            form={formInfo}
          />
        </FormioTranslations.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

export default I18NManager;
export { I18NManager, loadLocaleData, loadFormioTranslations };

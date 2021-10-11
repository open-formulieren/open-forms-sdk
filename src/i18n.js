import messagesNL from './i18n/compiled/nl.json';
import messagesEN from './i18n/compiled/en.json';
import { get } from 'api';

const loadLocaleData = (locale) => {
    switch (locale) {
        case 'nl':
            return messagesNL;
        default:
            return messagesEN;
    }
};

const loadFormioTranslations = async (baseUrl) => {
  return get(`${baseUrl}translations/formio`);
};


export {loadLocaleData, loadFormioTranslations};

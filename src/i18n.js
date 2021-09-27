import messagesNL from './i18n/compiled/nl.json';
import messagesEN from './i18n/compiled/en.json';


const loadLocaleData = (locale) => {
    switch (locale) {
        case 'nl':
            return messagesNL;
        default:
            return messagesEN;
    }
};


export default loadLocaleData;

const loadLocaleData = (locale) => {
    switch (locale) {
        case 'nl':
            return import('./i18n/compiled/nl.json');
        default:
            return import('./i18n/compiled/en.json');
    }
};


export default loadLocaleData;

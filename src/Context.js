import React from 'react';

const ConfigContext = React.createContext({baseUrl: ''});
ConfigContext.displayName = 'ConfigContext';

const FormioTranslations = React.createContext({i18n: {}, language: ''});
FormioTranslations.displayName = 'FormioTranslations';



export { ConfigContext, FormioTranslations };

import React from 'react';

const ConfigContext = React.createContext({baseUrl: '', reCaptchaSiteKey: ''});
ConfigContext.displayName = 'ConfigContext';

export { ConfigContext };

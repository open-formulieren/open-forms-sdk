import PropTypes from 'prop-types';
import React, {useContext} from 'react';

const CosignContext = React.createContext({
  reportDownloadUrl: '',
});

CosignContext.displayName = 'CosignContext';

const CosignProvider = ({reportDownloadUrl = '', children}) => (
  <CosignContext.Provider
    value={{
      reportDownloadUrl,
    }}
  >
    {children}
  </CosignContext.Provider>
);

CosignProvider.propTypes = {
  reportDownloadUrl: PropTypes.string,
};

const useCosignContext = () => useContext(CosignContext);

export {CosignProvider, useCosignContext};

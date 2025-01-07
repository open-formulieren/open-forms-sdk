import PropTypes from 'prop-types';
import React, {useContext} from 'react';

const CosignContext = React.createContext({
  reportDownloadUrl: '',
  onCosignComplete: () => {},
});

CosignContext.displayName = 'CosignContext';

const CosignProvider = ({reportDownloadUrl, onCosignComplete, children}) => (
  <CosignContext.Provider
    value={{
      reportDownloadUrl,
      onCosignComplete,
    }}
  >
    {children}
  </CosignContext.Provider>
);

CosignProvider.propTypes = {
  reportDownloadUrl: PropTypes.string.isRequired,
  onCosignComplete: PropTypes.func.isRequired,
};

const useCosignContext = () => useContext(CosignContext);

export {CosignProvider, useCosignContext};

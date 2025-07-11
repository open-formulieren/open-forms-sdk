import React, {useContext} from 'react';

export interface CosignContextType {
  reportDownloadUrl: string;
  onCosignComplete: (reportUrl: string) => void;
}

const CosignContext = React.createContext<CosignContextType>({
  reportDownloadUrl: '',
  onCosignComplete: () => {},
});

CosignContext.displayName = 'CosignContext';

export interface CosignProviderProps extends CosignContextType {
  children?: React.ReactNode;
}

const CosignProvider: React.FC<CosignProviderProps> = ({
  reportDownloadUrl,
  onCosignComplete,
  children,
}) => (
  <CosignContext.Provider
    value={{
      reportDownloadUrl,
      onCosignComplete,
    }}
  >
    {children}
  </CosignContext.Provider>
);

const useCosignContext = () => useContext(CosignContext);

export {CosignProvider, useCosignContext};

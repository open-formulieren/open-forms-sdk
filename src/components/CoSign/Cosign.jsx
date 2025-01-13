import {useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import ErrorBoundary from 'components/Errors/ErrorBoundary';

import {CosignProvider} from './Context';

const Cosign = () => {
  const navigate = useNavigate();
  const [reportDownloadUrl, setReportDownloadUrl] = useState('');

  const onCosignComplete = reportUrl => {
    setReportDownloadUrl(reportUrl);
    navigate('/cosign/done');
  };

  return (
    <ErrorBoundary useCard>
      <CosignProvider reportDownloadUrl={reportDownloadUrl} onCosignComplete={onCosignComplete}>
        <Outlet />
      </CosignProvider>
    </ErrorBoundary>
  );
};

export default Cosign;

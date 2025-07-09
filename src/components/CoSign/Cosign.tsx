import {useState} from 'react';
import {Outlet, useNavigate} from 'react-router';

import ErrorBoundary from 'components/Errors/ErrorBoundary';

import {CosignProvider} from './Context';

const Cosign: React.FC = () => {
  const navigate = useNavigate();
  const [reportDownloadUrl, setReportDownloadUrl] = useState<string>('');

  const onCosignComplete = (reportUrl: string) => {
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

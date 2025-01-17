import {useNavigate, useSearchParams} from 'react-router-dom';

import {ConfirmationView} from 'components/PostCompletionViews';
import useFormContext from 'hooks/useFormContext';

import {useCreateAppointmentContext} from './CreateAppointmentState';

const Confirmation = () => {
  const form = useFormContext();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {reset, setProcessingError} = useCreateAppointmentContext();
  const statusUrl = params.get('statusUrl');
  if (!statusUrl) throw new Error('Missing statusUrl param');

  const onProcessingFailure = (submission, errorMessage) => {
    setProcessingError(errorMessage);
    navigate('../overzicht');
  };

  return (
    <ConfirmationView
      onFailure={onProcessingFailure}
      onConfirmed={reset}
      downloadPDFText={form.submissionReportDownloadLinkTitle}
    />
  );
};

Confirmation.propTypes = {};

export default Confirmation;

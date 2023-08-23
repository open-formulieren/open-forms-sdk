import React from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import SubmissionConfirmation from 'components/SubmissionConfirmation';
import useFormContext from 'hooks/useFormContext';

import {useCreateAppointmentContext} from './CreateAppointmentState';

const Confirmation = () => {
  const form = useFormContext();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {reset, setProcessingError} = useCreateAppointmentContext();
  const statusUrl = params.get('statusUrl');
  if (!statusUrl) throw new Error('Missing statusUrl param');

  const onProcessingFailure = errorMessage => {
    setProcessingError(errorMessage);
    navigate('../overzicht');
  };

  return (
    <SubmissionConfirmation
      statusUrl={statusUrl}
      onFailure={onProcessingFailure}
      onConfirmed={reset}
      donwloadPDFText={form.submissionReportDownloadLinkTitle}
    />
  );
};

Confirmation.propTypes = {};

export default Confirmation;

import React from 'react';
import {useSearchParams} from 'react-router-dom';

import SubmissionConfirmation from 'components/SubmissionConfirmation';
import useFormContext from 'hooks/useFormContext';

import {useCreateAppointmentContext} from './CreateAppointmentState';

const Confirmation = () => {
  const form = useFormContext();
  const [params] = useSearchParams();
  const {reset} = useCreateAppointmentContext();
  const statusUrl = params.get('statusUrl');
  if (!statusUrl) throw new Error('Missing statusUrl param');
  return (
    <SubmissionConfirmation
      statusUrl={statusUrl}
      onFailure={() => {}}
      onConfirmed={reset}
      donwloadPDFText={form.submissionReportDownloadLinkTitle}
    />
  );
};

Confirmation.propTypes = {};

export default Confirmation;

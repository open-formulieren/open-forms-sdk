interface InProgress {
  status: 'in_progress';
  result: '';
  errorMessage: never;
  publicReference: never;
  confirmationPageTitle: never;
  confirmationPageContent: never;
  reportDownloadUrl: never;
  paymentUrl: never;
  mainWebsiteUrl: string;
}

interface DoneSuccess {
  status: 'done';
  result: 'success';
  errorMessage: never;
  publicReference: string;
  confirmationPageTitle: string;
  confirmationPageContent: string;
  reportDownloadUrl: string;
  paymentUrl: string;
  mainWebsiteUrl: string;
}

interface DoneFailed {
  status: 'done';
  result: 'failed';
  errorMessage: string;
  publicReference: never;
  confirmationPageTitle: never;
  confirmationPageContent: never;
  reportDownloadUrl: never;
  paymentUrl: never;
  mainWebsiteUrl: string;
}

type Done = DoneSuccess | DoneFailed;

/**
 * @see `#/components/schemas/SubmissionProcessingStatus` in the API spec.
 */
export type SubmissionProcessingStatus = InProgress | Done;

/**
 * @see `#/components/schemas/LoginOption` in the API spec.
 */
export interface FormLoginOption {
  identifier: string;
  label: string;
  url: string;
  logo: {
    title: string;
    imageSrc: string;
    href: string;
    appearance: 'dark' | 'light';
  };
  isForGemachtigde: boolean;
}

export interface ButtonText {
  resolved: string;
}

/**
 * @see `#/components/schemas/MinimalFormStep` in the API spec.
 */
export interface MinimalFormStep {
  uuid: string;
  slug?: string | null;
  formDefinition: string;
  index: number;
  literals: {
    previousText: ButtonText;
    saveText: ButtonText;
    nextText: ButtonText;
  };
  url: string;
  isApplicable?: boolean;
}

export interface SubmissionStatementConfiguration {
  type: 'checkbox';
  key: string;
  label: string;
  validate?: {
    required?: boolean;
  };
}

/**
 * A form definition as returned by the detail endpoint.
 *
 * @see `#/components/schemas/Form` in the API spec.
 *
 * @note this definition is not complete yet, adapt as needed.
 */
export interface Form {
  uuid: string;
  name: string;
  loginRequired: boolean;
  translationEnabled: boolean;
  loginOptions: FormLoginOption[];
  autoLoginAuthenticationBackend: string;
  literals: {
    previousText: ButtonText;
    beginText: ButtonText;
    changeText: ButtonText;
    confirmText: ButtonText;
  };
  slug: string;
  url: string;
  steps: MinimalFormStep[];
  showProgressIndicator: boolean;
  showSummaryProgress: boolean;
  maintenanceMode: boolean;
  introductionPageContent: string;
  explanationTemplate: string;
  submissionAllowed: 'yes' | 'no_with_overview' | 'no_without_overview';
  submissionLimitReached: boolean;
  suspensionAllowed: boolean;
  sendConfirmationEmail: boolean;
  displayMainWebsiteLink: boolean;
  requiredFieldsWithAsterisk: boolean;
  resumeLinkLifetime: number; // number of days
  hideNonApplicableSteps: boolean;
  cosignLoginOptions: FormLoginOption[];
  cosignHasLinkInEmail: boolean;
  submissionStatementsConfiguration: SubmissionStatementConfiguration[];
  submissionReportDownloadLinkTitle: string;
}

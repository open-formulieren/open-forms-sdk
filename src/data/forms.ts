import type {FormioConfiguration} from './formio';

/**
 * @see `#/components/schemas/LoginOption` in the API spec.
 */
export interface FormLoginOption {
  identifier: string;
  label: string;
  url: string;
  logo?: {
    title: string;
    imageSrc: string;
    href: string;
    appearance: 'dark' | 'light';
  };
  isForGemachtigde: boolean;
  visible: boolean;
}

export interface ButtonText {
  resolved: string;
  value?: string;
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

/**
 * @see `#/components/schemas/MinimalFormStep` in the API spec.
 */
export interface FormStep {
  uuid: string;
  index: number;
  slug?: string | null;
  configuration: FormioConfiguration;
  formDefinition: string;
  name: string;
  url: string;
  isApplicable?: boolean;
  loginRequired: boolean;
  literals?: {
    previousText: ButtonText;
    saveText: ButtonText;
    nextText: ButtonText;
  };
}

export interface SubmissionStatementConfiguration {
  type: 'checkbox';
  key: 'privacyPolicyAccepted' | 'statementOfTruthAccepted';
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
  type: 'regular' | 'appointment' | 'single_step';
  loginRequired: boolean;
  translationEnabled: boolean;
  loginOptions: FormLoginOption[];
  autoLoginAuthenticationBackend: string;
  paymentRequired: boolean;
  appointmentOptions: null | {
    supportsMultipleProducts: null | boolean;
  };
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
  active: boolean;
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
  communicationPreferencesPortalUrl: string;
  helpCalloutPage: {
    display: 'before_start_page' | 'after_start_page' | 'never';
    /**
     * Rich text describing where to find help instructions.
     *
     * @note Only paragraphs, anchors, lists, bold and italic formatting are allowed.
     */
    content: string;
    image: string | null;
  };
  /**
   * Help dialog configuration.
   *
   * When the nested content field is not empty, the SDK should render help controls to
   * assist the user filling out the form.
   */
  helpDialog?: {
    /**
     * Rich text describing help instructions for the end-user.
     *
     * @note Only paragraphs, anchors, lists, bold and italic formatting are allowed.
     */
    content: string;
    /**
     * Image URL to display below the content.
     */
    image?: string | null;
  };
}

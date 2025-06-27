import type {SubmissionStatementConfiguration} from '@/data/forms';

export const PRIVACY_POLICY_ACCEPTED = {
  key: 'privacyPolicyAccepted',
  type: 'checkbox',
  validate: {required: true},
  label: 'I accept the privacy policy and consent to the processing of my personal data.',
} satisfies SubmissionStatementConfiguration;

export const STATEMENT_OF_TRUTH_ACCEPTED = {
  key: 'statementOfTruthAccepted',
  type: 'checkbox',
  validate: {required: true},
  label: 'I responded very honestly.',
} satisfies SubmissionStatementConfiguration;

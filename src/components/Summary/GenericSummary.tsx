import {Form, Formik} from 'formik';

import Card from '@/components/Card';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import Loader from '@/components/Loader';
import Price from '@/components/Price';
import SummaryConfirmation from '@/components/SummaryConfirmation';
import type {SubmissionStatementConfiguration} from '@/data/forms';
import type {StepSummaryData, Submission} from '@/data/submissions';

import FormStepSummary from './FormStepSummary';

type FormValues = Record<SubmissionStatementConfiguration['key'], boolean>;

export type SummaryPaymentProps =
  | {
      showPaymentInformation?: false;
      amountToPay?: string | number;
    }
  | {
      showPaymentInformation: true;
      amountToPay: string | number;
    };

export type SummaryEditProps =
  | {
      blockEdit?: false;
      /**
       * Label of the link to edit the step data.
       */
      editStepText: React.ReactNode;
    }
  | {
      blockEdit: true;
      editStepText?: never;
    };

export interface SharedProps {
  title: React.ReactNode;
  isLoading: boolean;
  submissionAllowed: Submission['submissionAllowed'];
  isAuthenticated: boolean;
  summaryData: StepSummaryData[];
  prevPage?: string;
  errors?: React.ReactNode[];
  onDestroySession: () => Promise<void>;
  onSubmit: (statementValues: FormValues) => Promise<void>;
}

export type GenericSummaryProps = SharedProps & SummaryPaymentProps & SummaryEditProps;

/**
 * Used by both the `SubmissionSummary` and `CosignSummary` components, to display the
 * form field values that were submitted by the user.
 */
const GenericSummary: React.FC<GenericSummaryProps> = ({
  title,
  submissionAllowed,
  summaryData,
  isLoading,
  isAuthenticated,
  prevPage,
  errors = [],
  onSubmit,
  onDestroySession,
  ...props
}) => {
  const Wrapper = submissionAllowed === 'yes' ? Form : 'div';

  if (isLoading) {
    return (
      <Card title={title}>
        <Loader modifiers={['centered']} />
      </Card>
    );
  }

  return (
    <Card title={title}>
      {errors.map((error, index) => (
        <div className="openforms-card__alert" key={`error-${index}`}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      ))}
      <Formik<FormValues>
        initialValues={{privacyPolicyAccepted: false, statementOfTruthAccepted: false}}
        onSubmit={(values, actions) => {
          onSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        <Wrapper>
          {summaryData.map((step, index) => {
            return (
              <FormStepSummary
                key={`${index}-${step.slug}`}
                name={step.name}
                data={step.data}
                {...(props.blockEdit
                  ? {blockEdit: true}
                  : {
                      editStepText: props.editStepText,
                      editUrl: `/stap/${step.slug}`,
                    })}
              />
            );
          })}
          {props.showPaymentInformation && <Price price={props.amountToPay} />}
          <SummaryConfirmation
            submissionAllowed={submissionAllowed}
            prevPage={prevPage}
            isAuthenticated={isAuthenticated}
            onDestroySession={onDestroySession}
          />
        </Wrapper>
      </Formik>
    </Card>
  );
};

export default GenericSummary;

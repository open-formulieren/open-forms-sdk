/**
 * Display a modal to allow the user to save the form step in it's current state.
 */
import {TextField} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {Button as UtrechtButton} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {post} from '@/api';
import Body from '@/components/Body';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import Loader from '@/components/Loader';
import Modal from '@/components/modals/Modal';

const emailValidationSchema = z.object({
  email: z.string().email(),
});

const FIELD_LABELS = defineMessages<string>({
  email: {
    description: 'Form save modal email field label',
    defaultMessage: 'Your email address',
  },
});

interface FormikValues {
  email: string;
}

export interface FormStepSaveModalProps {
  /**
   * Modal open/closed state.
   */
  isOpen: boolean;
  /**
   * Callback function to close the modal
   *
   * Invoked on ESC keypress or clicking the "X" to close the modal.
   */
  closeModal: () => void;
  /**
   * Callback to execute when the submission session is destroyed, effectively logging
   * out the user.
   */
  onSessionDestroyed: () => void;
  /**
   * Callback to persist the submission data to the backend.
   */
  onSaveConfirm: () => Promise<void>;
  /**
   * Backend API endpoint to suspend the submission.
   */
  suspendFormUrl: string;
  /**
   * Duration that the resume URL is valid for, in days.
   */
  suspendFormUrlLifetime: number;
}

const FormStepSaveModal: React.FC<FormStepSaveModalProps> = ({
  isOpen,
  closeModal,
  onSaveConfirm,
  onSessionDestroyed,
  suspendFormUrl,
  suspendFormUrlLifetime,
  ...props
}) => {
  const intl = useIntl();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!isOpen && errorMessage) {
      setErrorMessage('');
    }
  }, [isOpen, errorMessage]);

  const errorMap: z.ZodErrorMap = (issue, ctx) => {
    const fieldLabelDefinition = FIELD_LABELS[issue.path.join('.')];
    if (!fieldLabelDefinition) {
      return {message: ctx.defaultError}; // use global schema as fallback
    }
    const fieldLabel = intl.formatMessage(fieldLabelDefinition);

    switch (issue.code) {
      case z.ZodIssueCode.invalid_type: {
        if (issue.received === z.ZodParsedType.undefined) {
          const message = intl.formatMessage(
            {
              description: 'Required field error message',
              defaultMessage: '{field} is required.',
            },
            {
              field: fieldLabel,
            }
          );
          return {message};
        }
        break;
      }
      case z.ZodIssueCode.invalid_string: {
        if (issue.validation === 'email') {
          const message = intl.formatMessage(
            {
              description: 'Invalid email validation error',
              defaultMessage: "{field} must be a valid email address, like 'willem@example.com'.",
            },
            {
              field: fieldLabel,
            }
          );
          return {message};
        }
        break;
      }
      default: {
        break;
      }
    }
    return {message: ctx.defaultError}; // use global schema as fallback
  };

  const onSubmit = async ({email}: FormikValues) => {
    setErrorMessage('');

    try {
      await onSaveConfirm();
    } catch {
      setErrorMessage(
        intl.formatMessage({
          description: 'Modal saving data failed message',
          defaultMessage: 'Saving the data failed, please try again later',
        })
      );
      return;
    }

    try {
      await post(suspendFormUrl, {email});
    } catch {
      setErrorMessage(
        intl.formatMessage({
          description: 'Modal suspending form failed message',
          defaultMessage: 'Suspending the form failed, please try again later',
        })
      );
      return;
    }
    onSessionDestroyed();
  };

  return (
    <Modal
      title={
        <FormattedMessage
          description="Form save modal title"
          defaultMessage="Save and resume later"
        />
      }
      isOpen={isOpen}
      closeModal={closeModal}
      {...props}
    >
      <Formik<FormikValues>
        initialValues={{email: ''}}
        onSubmit={onSubmit}
        validationSchema={toFormikValidationSchema(emailValidationSchema, {errorMap})}
      >
        {props => (
          <Body component="form" onSubmit={props.handleSubmit} noValidate>
            {props.isSubmitting && <Loader modifiers={['centered']} />}

            {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

            <Body modifiers={['big']}>
              <FormattedMessage
                description="Form save modal body text"
                defaultMessage="Enter your email address to get an email to resume the form at a later date. This can be done on any device where you open the link. The link remains valid for {numberOfDays, plural, one {1 day} other {{numberOfDays} days}}."
                values={{numberOfDays: suspendFormUrlLifetime}}
              />
            </Body>
            <TextField
              type="email"
              name="email"
              isRequired
              label={intl.formatMessage(FIELD_LABELS.email)}
              description={
                <FormattedMessage
                  description="Form save modal email field help text"
                  defaultMessage="The email address where you will receive the resume link."
                />
              }
              autoComplete="email"
            />

            <ButtonGroup className="openforms-form-navigation" direction="column">
              <UtrechtButton
                type="submit"
                appearance="primary-action-button"
                disabled={props.isSubmitting}
              >
                <FormattedMessage
                  description="Form save modal submit button"
                  defaultMessage="Continue later"
                />
              </UtrechtButton>
            </ButtonGroup>
          </Body>
        )}
      </Formik>
    </Modal>
  );
};

export default FormStepSaveModal;

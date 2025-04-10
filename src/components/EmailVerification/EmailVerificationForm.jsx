import {TextField} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {Link as UtrechtLink} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {post} from 'api';
import Body from 'components/Body';
import {ErrorDisplay} from 'components/Errors';
import ErrorMessage from 'components/Errors/ErrorMessage';
import {ValidationError} from 'errors';

import EnterCodeButton from './EnterCodeButton';
import ModeField from './ModeField';
import SendCodeButton from './SendCodeButton';

const submitVerificationCode = async (
  baseUrl,
  {submissionUrl, componentKey, emailAddress, code}
) => {
  await post(`${baseUrl}submissions/email-verifications/verify`, {
    submission: submissionUrl,
    componentKey,
    email: emailAddress,
    code,
  });
};

const getValidationSchema = intl =>
  z.object({
    code: z
      .string()
      .length(
        6,
        intl.formatMessage({
          description: 'Validation error message for verification codes with length != 6',
          defaultMessage: 'The verification code must contain exactly six characters.',
        })
      )
      .regex(
        /[A-Z0-9]{6}/,
        intl.formatMessage({
          description: 'Validation error message for verification code pattern',
          defaultMessage: 'The verification code may only contain letters (A-Z) and numbers (0-9).',
        })
      ),
  });

const EmailVerificationForm = ({submissionUrl, componentKey, emailAddress, onVerified}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const [error, setError] = useState(null);

  /**
   * On Formik submit, submit the verification code to the backend. If all is okay,
   * the local state is updated so that the success message is displayed, otherwise
   * display any validation errors.
   */
  const onSubmit = async (values, helpers) => {
    setError(null);
    try {
      await submitVerificationCode(baseUrl, {
        submissionUrl,
        componentKey,
        emailAddress,
        code: values.code,
      });
      onVerified();
    } catch (e) {
      if (e instanceof ValidationError) {
        const errors = {};
        e.invalidParams.forEach(({name, reason}) => {
          // TODO: replace newlines with proper solution...
          const hasErrorAlready = !!errors[name];
          if (!hasErrorAlready) errors[name] = '';
          errors[name] += `${hasErrorAlready ? '\n' : ''}${reason}`;
        });
        helpers.setErrors(errors);
      } else {
        setError(e);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{mode: 'sendCode', code: ''}}
      validationSchema={toFormikValidationSchema(getValidationSchema(intl))}
      onSubmit={onSubmit}
    >
      {({handleSubmit, values: {mode}, setFieldValue}) =>
        error ? (
          <Body component="div">
            <ErrorDisplay error={error} />
          </Body>
        ) : (
          <Body component="form" onSubmit={handleSubmit}>
            {!emailAddress ? (
              <ErrorMessage level="warning">
                <FormattedMessage
                  description="Email verification modal: warning that no email is specified"
                  defaultMessage="You haven't entered an email address yet."
                />
              </ErrorMessage>
            ) : (
              <>
                <Body modifiers={['big']}>
                  <FormattedMessage
                    description="Email verification modal body text"
                    defaultMessage={`You are verifying the email address <link>{emailAddress}</link>.
                  First, we need to send you a verification code on this email address. Then,
                  you need to enter the code to confirm it.`}
                    values={{
                      emailAddress,
                      link: chunks => (
                        <UtrechtLink href={`mailto:${emailAddress}`}>{chunks}</UtrechtLink>
                      ),
                    }}
                  />
                </Body>

                <div className="openforms-form-field-container">
                  <ModeField />
                  {mode === 'enterCode' && (
                    <TextField
                      name="code"
                      isRequired
                      label={
                        <FormattedMessage
                          description="Email verification: code input field label"
                          defaultMessage="Enter the six-character code"
                        />
                      }
                      pattern="[A-Z0-9]{6}"
                      description={
                        <FormattedMessage
                          description="Email verification: code input field description"
                          defaultMessage="The code is exactly six characters long and consists of only uppercase letters and numbers."
                        />
                      }
                      onChange={event => {
                        setFieldValue('code', event.target.value.toUpperCase());
                      }}
                    />
                  )}
                </div>
              </>
            )}

            <ButtonGroup direction="column" className="openforms-form-navigation">
              {mode === 'sendCode' && (
                <SendCodeButton
                  submissionUrl={submissionUrl}
                  componentKey={componentKey}
                  emailAddress={emailAddress}
                  onError={error => setError(error)}
                />
              )}
              {mode === 'enterCode' && <EnterCodeButton />}
            </ButtonGroup>
          </Body>
        )
      }
    </Formik>
  );
};

EmailVerificationForm.propTypes = {
  submissionUrl: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
  onVerified: PropTypes.func.isRequired,
};

export default EmailVerificationForm;

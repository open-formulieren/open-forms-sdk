import {Link as UtrechtLink} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {post} from 'api';
import Body from 'components/Body';
import {OFButton} from 'components/Button';
import Loader from 'components/Loader';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {TextField} from 'components/forms';
import {ValidationError} from 'errors';

import ModeField from './ModeField';
import SendCodeButton from './SendCodeButton';

const createVerification = async (baseUrl, {submissionUrl, componentKey, emailAddress}) => {
  await post(`${baseUrl}submissions/email-verifications`, {
    submission: submissionUrl,
    componentKey,
    email: emailAddress,
  });
};

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

const EmailVerificationForm = ({submissionUrl, componentKey, emailAddress}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [codeSending, setCodeSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  return (
    <Formik
      initialValues={{
        mode: 'sendCode',
        code: '',
      }}
      onSubmit={async (values, helpers) => {
        try {
          await submitVerificationCode(baseUrl, {
            submissionUrl,
            componentKey,
            emailAddress,
            code: values.code,
          });
          setIsVerified(true);
        } catch (e) {
          if (e instanceof ValidationError) {
            // TODO: set in formik state
            console.error(e.invalidParams);
          } else {
            throw e;
          }
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({handleSubmit, values: {mode}, setFieldValue, isSubmitting}) =>
        isVerified ? (
          <VerificationSuccess />
        ) : (
          <Body component="form" onSubmit={handleSubmit}>
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
                />
              )}
            </div>

            <Toolbar modifiers={['bottom', 'reverse']}>
              <ToolbarList>
                {mode === 'sendCode' && (
                  <SendCodeButton
                    isSending={codeSending}
                    onSendCode={async () => {
                      if (!emailAddress) {
                        // TODO: proper handling
                        alert('no email set');
                        return;
                      }
                      setCodeSending(true);
                      try {
                        await createVerification(baseUrl, {
                          submissionUrl,
                          componentKey,
                          emailAddress,
                        });
                      } catch (e) {
                        if (e instanceof ValidationError) {
                          // TODO: set in formik state
                          console.error(e.invalidParams);
                        } else {
                          throw e;
                        }
                      } finally {
                        setCodeSending(false);
                      }

                      setFieldValue('mode', 'enterCode');
                    }}
                  />
                )}
                {mode === 'enterCode' && (
                  <OFButton
                    type="submit"
                    appearance="primary-action-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
                    ) : (
                      <FormattedMessage
                        description="Email verification: verify code button text"
                        defaultMessage="Verify"
                      />
                    )}
                  </OFButton>
                )}
              </ToolbarList>
            </Toolbar>
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
};

const VerificationSuccess = () => (
  <Body modifiers={['big']}>
    <FormattedMessage
      description="Text displayed after successful email verification"
      defaultMessage={`The email address has now been verified. You can close this
      window and continue with the rest of the form.`}
    />
  </Body>
);

export default EmailVerificationForm;

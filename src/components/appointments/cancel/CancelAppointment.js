import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {FormattedDate, FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {post} from 'api';
import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {EmailField} from 'components/forms';
import {ValidationError} from 'errors';
import useQuery from 'hooks/useQuery';

const CancelAppointment = () => {
  const {baseUrl} = useContext(ConfigContext);
  const navigate = useNavigate();
  const queryParams = useQuery();

  const [failed, setFailed] = useState(false);

  // validate the necessary information to know which submission we are dealing with
  const timeParam = queryParams.get('time');
  const submissionId = queryParams.get('submission_uuid');

  // input validation - show error message if people are messing with URLs rather
  // than crashing hard.
  if (!timeParam) {
    return (
      <ErrorMessage>
        <FormattedMessage
          description="Appointment cancellation missing time query string parameter"
          defaultMessage="Failed to determine the appointment time"
        />
      </ErrorMessage>
    );
  }

  if (!submissionId) {
    return (
      <ErrorMessage>
        <FormattedMessage
          description="Appointment cancellation missing submission ID query string parameter"
          defaultMessage="Failed to determine the appointment"
        />
      </ErrorMessage>
    );
  }

  // parse into native Date object - we receive an ISO-8601 string.
  const time = new Date(timeParam);

  const onSubmit = async ({email}, actions) => {
    const endpoint = `${baseUrl}appointments/${submissionId}/cancel`;
    try {
      await post(endpoint, {email});
    } catch (e) {
      if (e instanceof ValidationError) {
        const error = e.invalidParams.map(invalidParam => invalidParam.reason).join('\n');
        actions.setFieldError('email', error);
      } else {
        setFailed(true);
      }
      return;
    } finally {
      actions.setSubmitting(false);
    }

    navigate('/afspraak-annuleren/succes');
  };

  return (
    <Card
      title={
        <FormattedMessage
          description="Cancel appointment title"
          defaultMessage="Cancel appointment"
        />
      }
    >
      <Formik initialValues={{email: ''}} onSubmit={onSubmit}>
        {props => (
          <Body component="form" onSubmit={props.handleSubmit}>
            {failed && (
              <ErrorMessage>
                <FormattedMessage
                  description="Appointment cancellation error message"
                  defaultMessage="Appointment cancellation failed"
                />
              </ErrorMessage>
            )}

            <div className="openforms-form-field-container">
              <Body modifiers={['big']}>
                <FormattedMessage
                  description="Appointment cancellation body text"
                  defaultMessage={`You're about to cancel your appointment on <b>{date}</b> at <b>{time}</b>. Please fill
out your email address for verification purposes.`}
                  values={{
                    date: <FormattedDate value={time} day="numeric" month="long" />,
                    time: <FormattedDate value={time} hour="numeric" minute="numeric" />,
                    b: chunks => <strong>{chunks}</strong>,
                  }}
                />
              </Body>

              <EmailField
                name="email"
                isRequired
                label={
                  <FormattedMessage
                    description="Appointment cancellation email field label"
                    defaultMessage="Your email address"
                  />
                }
                description={
                  <FormattedMessage
                    description="Cancel appointment email field help text"
                    defaultMessage="The email address where you received the appointment confirmation email."
                  />
                }
              />
            </div>

            <Toolbar modifiers={['bottom', 'reverse']}>
              <ToolbarList>
                <Button type="submit" variant="primary">
                  <FormattedMessage
                    description="Cancel appointment submit button"
                    defaultMessage="Cancel appointment"
                  />
                </Button>
              </ToolbarList>
            </Toolbar>
          </Body>
        )}
      </Formik>
    </Card>
  );
};

export default CancelAppointment;

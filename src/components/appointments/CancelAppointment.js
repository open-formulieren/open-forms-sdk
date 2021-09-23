import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { post } from 'api';

import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import Label from 'components/Label';
import HelpText from 'components/HelpText';
import Input from 'components/Input';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {ConfigContext} from 'Context';
import useQuery from 'hooks/useQuery';
import {getBEMClassName} from 'utils';

const CancelAppointment = () => {
  const {baseUrl} = useContext(ConfigContext);
  const history = useHistory();
  const queryParams = useQuery();

  const [email, setEmail] = useState("");
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

  const onSubmit = async (event) => {
    event && event.preventDefault();

    const endpoint = `${baseUrl}appointments/${submissionId}/cancel`;
    const response = await post(endpoint, {email});
    // TODO: properly show validation errors!
    if (!response.ok) {
      setFailed(true);
      return;
    }
    history.push("/afspraak-annuleren/succes");
  };

  return (
    <Card title={<FormattedMessage description="Cancel appointment title" defaultMessage="Cancel appointment" />}>
        <Body component="form" onSubmit={onSubmit}>

          <Body modifiers={['big']}>
            <FormattedMessage
              description="Appointment cancellation body text"
              defaultMessage={
`You're about to cancel your appointment on <b>{date}</b> at <b>{time}</b>. Please fill
out your email address for verification purposes.`}
              values={{
                date: (<FormattedDate value={time} day="numeric" month="long" />),
                time: (<FormattedDate value={time} hour="numeric" minute="numeric" />),
                b: chunks => <strong>{chunks}</strong>,
              }}
            />
          </Body>

          <div className={getBEMClassName('form-control')}>

            <Label isRequired >
              <FormattedMessage
                description="Appointment cancellation email field label"
                defaultMessage="Your email address" />
            </Label>

            <Input type="email" value={email} onChange={event => setEmail(event.target.value)} />

            <HelpText>
              <FormattedMessage
                description="Cancel appointment email field help text"
                defaultMessage="The email address where you received the appointment confirmation email."
              />
            </HelpText>

          </div>

          {
            failed
            ? (
              <ErrorMessage>
                <FormattedMessage
                  description="Appointment cancellation error message"
                  defaultMessage="Appointment cancellation failed"
                />
              </ErrorMessage>
            )
            : null
          }

          <Toolbar modifiers={['bottom', 'reverse']}>
            <ToolbarList>
              <Button type="submit" variant="primary">
                <FormattedMessage description="Cancel appointment submit button" defaultMessage="Cancel appointment" />
              </Button>
            </ToolbarList>
          </Toolbar>

        </Body>
    </Card>
  );
};

export default CancelAppointment;

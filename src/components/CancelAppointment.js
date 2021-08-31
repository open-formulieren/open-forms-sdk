import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {FormattedDate, FormattedMessage} from 'react-intl';
import {post} from 'api';
import PropTypes from 'prop-types';

import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import Label from 'components/Label';
import HelpText from 'components/HelpText';
import Input from 'components/Input';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import VerticalSpacer from 'components/VerticalSpacer';

const CancelAppointment = ({ baseUrl }) => {

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const queryParams = new URLSearchParams(useLocation().search);
  const time = queryParams.get("time").split(" ")[0];
  const submission_uuid = queryParams.get("submission_uuid");

  return (
    <Card title="Afspraak annuleren">
        <Body component="div">
          <p>
            <FormattedMessage id="uwAfspraakOp" defaultMessage="U staat op het punt om uw afspraak op " />
            {<FormattedDate
              value={time}
              day="numeric"
              month="long"
            />}
            <FormattedMessage id="om" defaultMessage=" om " />
            {new Date(time).toLocaleTimeString().replace(":", ".").split(":")[0]}
            <FormattedMessage id="teAnnuleren" defaultMessage="  te annuleren. Vul ter validatie uw e-mailadres in." />
          </p>

          <VerticalSpacer pixels={60} />

          <Label
            text={<FormattedMessage id="uwEmailAdres" defaultMessage="Uw email-adres" />}
            isRequired={true}
          />
          <Input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <VerticalSpacer />

          <HelpText
            text={<FormattedMessage
                    id="emailHelpText"
                    defaultMessage="Het e-mail adres waar de bevestigingsmail naar toe is gestuurd."
            />}
          />

          {errorMessage && <ErrorMessage text={errorMessage}/>}

          <Toolbar modifiers={["bottom","reverse"]}>
            <ToolbarList>
              <Button
                variant="primary"
                onClick={() => {
                  post(`${baseUrl}appointments/${submission_uuid}/cancel`, {email})
                    .then(() => history.push("/afspraak-annuleren-success"))
                    .catch(() => {
                      setErrorMessage(<FormattedMessage
                                        id="cancelError"
                                        defaultMessage="Kan afspraak niet annuleren"
                      />)
                    });
                }}
              >
                <FormattedMessage id="afspraakAnnuleren" defaultMessage="Afspraak annuleren" />
              </Button>
            </ToolbarList>
          </Toolbar>
        </Body>
    </Card>
  );
};

CancelAppointment.propTypes = {
  baseUrl: PropTypes.string.isRequired
};

export default CancelAppointment;

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import Anchor from 'components/Anchor';
import Loader from 'components/Loader';
import usePoll from 'hooks/usePoll';


/**
 * Renders the confirmation page displayed after submitting a form.
 * @param statusUrl - The URL where to check if the processing of the submission is complete
 */
const SubmissionConfirmation = ({statusUrl}) => {
  const [statusResponse, setStatusResponse] = useState(null);

  const {loading, error} = usePoll(
    statusUrl,
    1000,
    (response) => {
      setStatusResponse(response);
      switch (response.status) {
        case 'done': {
          return true;
        }
        default: {
          // nothing, it's pending/started or retrying
        }
      }
    }
  );

  if (error) {
    console.error(error);
  }

  if (loading) {
    return (
      <Card title={<FormattedMessage
                    id="SubmissionConfirmation.pending.title"
                    description="Checking background processing status title"
                    defaultMessage="Processing..." />}>

        <Loader modifiers={['centered']} />
        <Body>
          <FormattedMessage
            id="SubmissionConfirmation.pending.body"
            description="Checking background processing status body"
            defaultMessage="Please hold on while we're processing your submission."
          />
        </Body>

      </Card>
    );
  }

  console.log(statusResponse);

  return null;
  /*
  return (
    <Card title="Bevestiging">
        <Body component="div" dangerouslySetInnerHTML={{__html: content}} />
        {
          loading
          ? (
            <>
              <Loader modifiers={['centered']}/>
              <Body>Even geduld terwijl we uw bevestiging in PDF-formaat genereren...</Body>
            </>
          )
          : (
            error
            ? (
              <Body>Er ging iets fout bij het genereren van de PDF.</Body>
            )
            : (
              <>
                <FAIcon icon="download" aria-hidden="true" modifiers={['inline']} />
                <Anchor href={reportDownloadUrl}>PDF downloaden</Anchor>
              </>
            )
          )
        }
    </Card>
  );
  */
}

SubmissionConfirmation.propTypes = {
  statusUrl: PropTypes.string.isRequired,
}

export default SubmissionConfirmation;

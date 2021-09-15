import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import Anchor from 'components/Anchor';
import Loader from 'components/Loader';
import usePoll from 'hooks/usePoll';

const RESULT_FAILED = 'failed';


/**
 * Given a start URL, fetches the payment start information and renders the UI controls
 * to enter the payment flow.
 * @param  {String} startUrl The payment start URL received from the backend.
 * @return {JSX}
 */
const StartPayment = ({startUrl}) => {
  return null;
};

StartPayment.propTypes = {
  startUrl: PropTypes.string.isRequired,
};


/**
 * Renders the confirmation page displayed after submitting a form.
 * @param statusUrl - The URL where to check if the processing of the submission is complete
 */
const SubmissionConfirmation = ({statusUrl, onFailure}) => {
  const [statusResponse, setStatusResponse] = useState(null);

  const {loading, error} = usePoll(
    statusUrl,
    1000,
    (response) => {
      setStatusResponse(response);
      switch (response.status) {
        case 'done': {
          if (response.result === RESULT_FAILED) {
            onFailure && onFailure(response.errorMessage);
          }
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

  // process API output now that processing is done
  const {
    result,
    paymentUrl,
    publicReference,
    reportDownloadUrl,
    confirmationPageContent,
  } = statusResponse;

  if (result === RESULT_FAILED) {
    throw new Error('Failure should have been handled in the onFailure prop.');
  }

  return (
    <Card title={<FormattedMessage
                   id="SubmissionConfirmation.done.title"
                   description="On succesful completion title"
                   defaultMessage="Bevestiging: {reference}"
                   values={{reference: publicReference}}
                 />}>

      <Body component="div" dangerouslySetInnerHTML={{__html: confirmationPageContent}} />

      <>
        <FAIcon icon="download" aria-hidden="true" modifiers={['inline']} />
        <Anchor href={reportDownloadUrl}>
          <FormattedMessage
            id="SubmissionConfirmation.pdfLink.title"
            description="Download report PDF link title"
            defaultMessage="Download PDF"
          />
        </Anchor>
      </>

      { paymentUrl ? <StartPayment startUrl={paymentUrl} /> : null }

    </Card>
  );
}

SubmissionConfirmation.propTypes = {
  statusUrl: PropTypes.string.isRequired,
  onFailure: PropTypes.func,
}

export default SubmissionConfirmation;

import React from 'react';
import PropTypes from 'prop-types';

import Body from 'Body';
import Card from 'Card';
import FAIcon from 'FAIcon';
import Anchor from 'Anchor';
import Loader from 'Loader';
import usePoll from 'hooks/usePoll';


/**
 * Renders the confirmation page displayed after submitting a form.
 * @param reportDownloadUrl - The URL where the PDF of the submission report can be downloaded
 * @param reportStatusUrl - The URL where to check if the generation of the report is complete
 * @param content - Content to display in the confirmation page
 */
const SubmissionConfirmation = ({
  reportDownloadUrl,
  reportStatusUrl,
  content,
}) => {
  const {loading, error} = usePoll(
    reportStatusUrl,
    5000,
    response => {
      switch (response.status) {
        case 'SUCCESS': {
          return true;
        }
        case 'FAILURE': {
          throw new Error('Failure while generating the submission report');
        }
        default: {
          // nothing, it's pending/started or retrying
        }
      }
    }
  );

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
}

SubmissionConfirmation.propTypes = {
  reportDownloadUrl: PropTypes.string.isRequired,
  reportStatusUrl: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

export default SubmissionConfirmation;

import React from 'react';
import PropTypes from "prop-types";
import useAsync from "react-use/esm/useAsync";

import Body from "./Body";
import Card from "./Card";
import FAIcon from "./FAIcon";
import Anchor from "./Anchor";
import {get} from "./api";
import Loader from './Loader';



/**
 * Renders the confirmation page displayed after submitting a form.
 * @param submissionReportUrl - The URL where the PDF of the submission report can be downloaded
 * @param reportStatusUrl - The URL where to check if the generation of the report is complete
 * @param confirmationPageContent - Content to display in the confirmation page
 * @param onSubmissionReportReady - Call back for updating the state when the report is ready
 * @param submissionReportReady - Whether the submission report is ready or not.
 */
const SubmissionConfirmation = ({
  submissionReportUrl,
  reportStatusUrl,
  confirmationPageContent,
  onSubmissionReportReady,
  submissionReportReady
}) => {
  const state = useAsync(
    async () => {
      await checkReportStatus(reportStatusUrl);
    }, []
  );

  const checkReportStatus = async (reportStatusUrl) => {
    let response = await get(reportStatusUrl);
    if (response.status !== 'SUCCESS' && response.status !== 'FAILURE') {
      await setTimeout(checkReportStatus, 5000, reportStatusUrl);
    } else if (response.status === 'FAILURE') {
      throw new Error("Failure while generating the submission report");
    } else if (response.status === 'SUCCESS') {
      onSubmissionReportReady();
    }
  };

  const downloadReport = () => {
    if (submissionReportReady) {
      return (
        <>
          <FAIcon icon="download" aria-hidden="true"> </FAIcon>
          <Anchor href={submissionReportUrl}>Download submission data</Anchor>
        </>
      );
    } else if (state.error) {
        return (<Body>Something went wrong while generating the submission summary.</Body>);
    } else if (!submissionReportReady) {
      return (
        <>
          <Loader modifiers={['centered']}/>
          <Body>Even geduld terwijl we uw bevestiging in PDF-formaat genereren...</Body>
        </>
      );
    }
  }

  return (
    <Card title="Bevestiging">
        <Body component="div" dangerouslySetInnerHTML={{__html: confirmationPageContent}} />
        {downloadReport()}
    </Card>
  );
}

SubmissionConfirmation.propTypes = {
  submissionReportUrl: PropTypes.string.isRequired,
  reportStatusUrl: PropTypes.string.isRequired,
  confirmationPageContent: PropTypes.string.isRequired,
  onSubmissionReportReady: PropTypes.func.isRequired,
  submissionReportReady: PropTypes.bool.isRequired,
}

export {SubmissionConfirmation};

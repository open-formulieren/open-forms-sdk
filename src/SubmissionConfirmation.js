import Body from "./Body";
import Card from "./Card";
import PropTypes from "prop-types";
import FAIcon from "./FAIcon";
import Anchor from "./Anchor";
import useAsync from "react-use/esm/useAsync";
import {get} from "./api";


/**
 * Renders the confirmation page displayed after submitting a form.
 * @param submissionReportUrl - The URL where the PDF of the submission report can be downloaded
 * @param confirmationPageContent - Content to display in the confirmation page
 * @constructor
 */
const SubmissionConfirmation = ({submissionReportUrl, reportStatusUrl, confirmationPageContent}) => {
  const state = useAsync(
    async () => {
      await checkReportStatus(reportStatusUrl);
    }, []
  );

  const checkReportStatus = async (reportStatusUrl) => {
    let response = await get(reportStatusUrl);

    if (response.status !== 'SUCCESS' && response.status !== 'FAILURE') {
      setTimeout(checkReportStatus, 5000, reportStatusUrl);
    } else if (response.status === 'FAILURE') {
      throw new Error("Failure while generating the submission report");
    }
  };

  const downloadReport = () => {
    if (!state.loading && !state.error) {
      return (
        <>
          <FAIcon icon="download" aria-hidden="true"> </FAIcon>
          <Anchor href={submissionReportUrl}>Download submission data</Anchor>
        </>
      );
    } else if (state.error) {
        return (<Body>Something went wrong while generating the submission summary.</Body>);
    } else if (state.loading) {
      return (
        <div className="loading">
          <span className="loading__spinner" />
          <Body>A PDF of your submission summary is being generated...</Body>
        </div>
      );
    }
  }

  return (
    <Card title="Confirmation">
        <Body>{confirmationPageContent}</Body>
        {downloadReport()}
    </Card>
  );
}

SubmissionConfirmation.propTypes = {
  submissionReportUrl: PropTypes.string.isRequired,
  reportStatusUrl: PropTypes.string.isRequired,
  confirmationPageContent: PropTypes.string.isRequired,
}

export {SubmissionConfirmation};

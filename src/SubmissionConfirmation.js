import Body from "./Body";
import Card from "./Card";
import PropTypes from "prop-types";
import FAIcon from "./FAIcon";
import Anchor from "./Anchor";

/**
 * Renders the confirmation page displayed after submitting a form.
 * @param submissionReportUrl - The URL where the PDF of the submission report can be downloaded
 * @param confirmationPageContent - Content to display in the confirmation page
 * @constructor
 */
const SubmissionConfirmation = ({submissionReportUrl, confirmationPageContent}) => {
  return (
    <Card title="Confirmation">
        <Body>{confirmationPageContent}</Body>
        <FAIcon icon="download" aria-hidden="true"> </FAIcon>
        <Anchor href={submissionReportUrl}>Download submission data</Anchor>
    </Card>
  );
}

SubmissionConfirmation.propTypes = {
  submissionReportUrl: PropTypes.string.isRequired,
  confirmationPageContent: PropTypes.string.isRequired,
}

export {SubmissionConfirmation};

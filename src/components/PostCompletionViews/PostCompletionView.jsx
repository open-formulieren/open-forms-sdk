import {ButtonGroup} from '@utrecht/button-group-react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Anchor from 'components/Anchor';
import Body from 'components/Body';
import {OFButton} from 'components/Button';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import useTitle from 'hooks/useTitle';

const PostCompletionView = ({
  downloadPDFText,
  pageTitle,
  header,
  body,
  mainWebsiteUrl,
  reportDownloadUrl,
  extraBody,
}) => {
  useTitle(pageTitle);

  const linkTitle = downloadPDFText || (
    <FormattedMessage description="Download report PDF link title" defaultMessage="Download PDF" />
  );

  return (
    <Card title={header}>
      {body}

      <Body>
        <FAIcon icon="download" aria-hidden="true" modifiers={['inline']} />
        <Anchor href={reportDownloadUrl} target="_blank" rel="noopener noreferrer">
          {linkTitle}
        </Anchor>
      </Body>

      {extraBody}

      {mainWebsiteUrl ? (
        <ButtonGroup className="utrecht-button-group--distanced" direction="column">
          <Anchor href={mainWebsiteUrl} rel="noopener noreferrer">
            <OFButton appearance="secondary-action-button">
              <FormattedMessage
                description="Back to main website link title"
                defaultMessage="Return to main website"
              />
            </OFButton>
          </Anchor>
        </ButtonGroup>
      ) : null}
    </Card>
  );
};

PostCompletionView.propTypes = {
  downloadPDFText: PropTypes.string,
  pageTitle: PropTypes.node,
  header: PropTypes.node,
  body: PropTypes.node,
  mainWebsiteUrl: PropTypes.string,
  reportDownloadUrl: PropTypes.string,
  extraBody: PropTypes.node,
};

export default PostCompletionView;

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Anchor from 'components/Anchor';
import Body from 'components/Body';
import {OFButton} from 'components/Button';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import useTitle from 'hooks/useTitle';

const PostCompletionView = ({
  downloadPDFText,
  pageTitle,
  header,
  body,
  mainWebsiteUrl,
  reportDownloadUrl,
  extraBottom,
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

      {mainWebsiteUrl ? (
        <Toolbar modifiers={['reverse']}>
          <ToolbarList>
            <Anchor href={mainWebsiteUrl} rel="noopener noreferrer">
              <OFButton appearance="primary-action-button">
                <FormattedMessage
                  description="Back to main website link title"
                  defaultMessage="Return to main website"
                />
              </OFButton>
            </Anchor>
          </ToolbarList>
        </Toolbar>
      ) : null}
      {extraBottom}
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
  extraBottom: PropTypes.node,
};

export default PostCompletionView;

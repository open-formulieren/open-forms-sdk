import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Anchor from 'components/Anchor';
import Body from 'components/Body';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';

const CosignDone = ({reportDownloadUrl}) => {
  return (
    <Card
      title={
        <FormattedMessage
          description="On succesful completion title"
          defaultMessage="Co-sign confirmation"
        />
      }
    >
      {/* TODO Make text configurable */}
      <Body component="div" modifiers={['wysiwyg']}>
        <FormattedMessage
          description="Co-sign confirmation page body"
          defaultMessage="Thank you for co-signing this submission."
        />
      </Body>

      <Body>
        <FAIcon icon="download" modifiers={['inline']} />
        <Anchor href={reportDownloadUrl} target="_blank" rel="noopener noreferrer">
          <FormattedMessage
            description="Download report PDF link title"
            defaultMessage="Download PDF report of the submission"
          />
        </Anchor>
      </Body>

      {/* TODO Add link to main website */}
    </Card>
  );
};

CosignDone.propTypes = {
  reportDownloadUrl: PropTypes.string.isRequired,
};

export default CosignDone;

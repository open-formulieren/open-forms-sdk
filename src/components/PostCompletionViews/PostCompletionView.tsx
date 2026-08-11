import {ButtonGroup} from '@utrecht/button-group-react';
import {Paragraph} from '@utrecht/component-library-react';
import {FormattedMessage} from 'react-intl';

import Anchor from '@/components/Anchor';
import Card from '@/components/Card';
import FAIcon from '@/components/FAIcon';
import useTitle from '@/hooks/useTitle';

export interface PostCompletionViewProps {
  downloadPDFText?: React.ReactNode;
  pageTitle?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
  mainWebsiteUrl?: string;
  reportDownloadUrl?: string;
  extraBody?: React.ReactNode;
}

const PostCompletionView: React.FC<PostCompletionViewProps> = ({
  downloadPDFText,
  pageTitle = '',
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

      <Paragraph>
        <FAIcon icon="download" inline />
        <Anchor href={reportDownloadUrl} target="_blank" rel="noopener noreferrer">
          {linkTitle}
        </Anchor>
      </Paragraph>

      {extraBody}

      {mainWebsiteUrl ? (
        <ButtonGroup direction="column">
          <Anchor
            as="button-link"
            href={mainWebsiteUrl}
            rel="noopener noreferrer"
            appearance="secondary-action-button"
          >
            <FormattedMessage
              description="Back to main website link title"
              defaultMessage="Return to main website"
            />
          </Anchor>
        </ButtonGroup>
      ) : null}
    </Card>
  );
};

export default PostCompletionView;

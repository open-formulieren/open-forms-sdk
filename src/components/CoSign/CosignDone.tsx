import {Paragraph} from '@utrecht/component-library-react';
import {FormattedMessage} from 'react-intl';

import Anchor from '@/components/Anchor';
import Body from '@/components/Body';
import Card from '@/components/Card';
import FAIcon from '@/components/FAIcon';
import useFormContext from '@/hooks/useFormContext';

import {useCosignContext} from './Context';

const CosignDone: React.FC = () => {
  const {reportDownloadUrl} = useCosignContext();
  const {name, sendConfirmationEmail} = useFormContext();

  return (
    <Card
      title={
        <FormattedMessage
          description="Cosign done page title"
          defaultMessage="Cosign confirmation"
        />
      }
    >
      {/* TODO Make text configurable */}
      <Body component="div" modifiers={['wysiwyg']}>
        <FormattedMessage
          description="Cosign confirmation page body"
          defaultMessage={`<p>Thank you for cosigning. We have received your "{formName}"
          submission. {confirmationEmailEnabled, select,
            true {You will receive a confirmation email.}
            other {}
          }</p>
          <p>Do not forget to download your summary, we do not send it via email.</p>
          `}
          values={{
            p: chunk => <Paragraph>{chunk}</Paragraph>,
            formName: name,
            confirmationEmailEnabled: sendConfirmationEmail,
          }}
        />
      </Body>

      <Body>
        <FAIcon icon="download" inline />
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

export default CosignDone;

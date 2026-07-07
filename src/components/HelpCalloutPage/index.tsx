import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Navigate} from 'react-router';

import Body from '@/components/Body';
import FAIcon from '@/components/FAIcon';
import FormContainer from '@/components/FormContainer';
import HelpButton from '@/components/HelpButton';
import Image from '@/components/Image';
import Link from '@/components/Link';
import {useSubmissionContext} from '@/components/SubmissionProvider';
import useFormContext from '@/hooks/useFormContext';
import useQueryParams from '@/hooks/useQueryParams';

const HelpCalloutPage: React.FC = () => {
  const {steps, helpCalloutPageContent, helpCalloutPageDisplay, helpCalloutPageImage} =
    useFormContext();
  const {submission} = useSubmissionContext();
  const {preserveQueryParams} = useQueryParams();
  const intl = useIntl();

  if (!helpCalloutPageContent || helpCalloutPageDisplay === 'never')
    // In case a user tries to navigate to this page manually when it shouldn't be visible, just
    // redirect to the start page directly.
    return <Navigate replace to={preserveQueryParams('startpagina')} />;

  let nextPageUrl: string;
  if (helpCalloutPageDisplay === 'before_start_page')
    nextPageUrl = preserveQueryParams('startpagina');
  else {
    // Sanity check
    if (!submission) throw new Error('Submission should already have been created');
    // No need to preserve query parameters, because the submission was already created.
    nextPageUrl = `/stap/${steps[0].slug}`;
  }

  return (
    <FormContainer>
      <div>
        <HelpButton />

        <div>
          <Body
            modifiers={['wysiwyg']}
            component="div"
            dangerouslySetInnerHTML={{__html: helpCalloutPageContent}}
          />

          {helpCalloutPageImage && (
            <Image
              src={helpCalloutPageImage}
              alt={intl.formatMessage({
                description: 'Help callout page image alt text',
                defaultMessage: 'Help callout page image',
              })}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <Link
        to={nextPageUrl}
        as="button-link"
        appearance="primary-action-button"
        className="openforms-start-link"
      >
        <FormattedMessage
          description="Button text for link to continue from introduction page to start page"
          defaultMessage="Continue"
        />
        <FAIcon icon="arrow-right-long" />
      </Link>
    </FormContainer>
  );
};

export default HelpCalloutPage;

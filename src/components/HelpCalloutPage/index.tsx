import {useIntl} from 'react-intl';
import {Navigate} from 'react-router';

import Body from '@/components/Body';
import FormContainer from '@/components/FormContainer';
import HelpButton from '@/components/HelpButton';
import Image from '@/components/Image';
import NextLink from '@/components/NextLink';
import {useSubmissionContext} from '@/components/SubmissionProvider';
import useFormContext from '@/hooks/useFormContext';
import useQueryParams from '@/hooks/useQueryParams';

const HelpCalloutPage: React.FC = () => {
  const {steps, helpCalloutPage} = useFormContext();
  const {submission} = useSubmissionContext();
  const {preserveQueryParams} = useQueryParams();
  const intl = useIntl();

  if (!helpCalloutPage.content || helpCalloutPage.display === 'never')
    // In case a user tries to navigate to this page manually when it shouldn't be visible, just
    // redirect to the start page directly.
    return <Navigate replace to={preserveQueryParams('startpagina')} />;

  let nextPageUrl: string;
  if (helpCalloutPage.display === 'before_start_page')
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
        <div className="openforms-help-callout-page-button-container">
          <HelpButton />
        </div>

        <div className="openforms-help-callout-page-dialog">
          <div className="openforms-help-callout-page-dialog__triangle"></div>
          <div className="openforms-help-callout-page-dialog__container">
            {helpCalloutPage.image && (
              <Image
                src={helpCalloutPage.image}
                alt={intl.formatMessage({
                  description: 'Help callout page image alt text',
                  defaultMessage: 'Help callout page image',
                })}
                className="openforms-help-callout-page-dialog__image"
                aria-hidden="true"
              />
            )}

            <Body
              modifiers={['wysiwyg']}
              component="div"
              dangerouslySetInnerHTML={{__html: helpCalloutPage.content}}
            />
          </div>
        </div>
      </div>

      <NextLink url={nextPageUrl} />
    </FormContainer>
  );
};

export default HelpCalloutPage;

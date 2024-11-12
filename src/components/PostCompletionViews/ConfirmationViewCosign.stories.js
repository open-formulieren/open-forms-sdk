import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from 'api-mocks';
import {AnalyticsToolsDecorator, withForm, withSubmissionPollInfo} from 'story-utils/decorators';

import {ConfirmationViewDisplay} from './ConfirmationView';

export default {
  title: 'Views / Cosign / Submission completed',
  component: ConfirmationViewDisplay,
  decorators: [withForm, AnalyticsToolsDecorator, withSubmissionPollInfo, withRouter],
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '/dummy',
    confirmationPageTitle: 'Request incomplete',
    confirmationPageContent: `
      <p>Your request is not yet complete.</p>
      <h2>Cosigning required</h2>
      <p>
        We've sent an email with a cosign request to
        <a href="mailto:info@example.com">info@example.com</a>. Once the submission has
        been cosigned we will start processing your request.
      </p>
      <p>
        If you need to contact us about this submission, you can use the reference
        <strong>OF-1234</strong>.
      </p>
      `,
    mainWebsiteUrl: 'https://example.com',
    paymentUrl: '',
  },
  argTypes: {
    paymentUrl: {control: false},
  },
  parameters: {
    formContext: {
      form: buildForm({
        cosignLoginOptions: [
          {
            identifier: 'digid',
            label: 'DigiD',
            url: 'http://localhost:8000/auth/digid/?next=http://localhost:8000/cosign&amp;code=123',
            logo: {
              title: 'DigiD simulatie',
              imageSrc: './digid.png',
              href: 'https://www.digid.nl/',
              appearance: 'dark',
            },
            isForGemachtigde: false,
          },
        ],
      }),
    },
    reactRouter: {
      location: {state: {}},
    },
  },
};

export const Default = {
  name: 'Submission completed',
};

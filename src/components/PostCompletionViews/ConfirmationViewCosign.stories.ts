import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';
import {withForm, withSubmissionPollInfo} from '@/sb-decorators';

import {ConfirmationViewDisplay} from './ConfirmationView';
import type {Args} from './ConfirmationView.stories';

export default {
  title: 'Views / Cosign / Submission completed',
  component: ConfirmationViewDisplay,
  decorators: [withForm, withSubmissionPollInfo, withRouter],
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '/dummy',
    confirmationPageTitle: 'Request incomplete',
    confirmationPageContent: `
      <p>Your request is not yet complete.</p>
      <h2>Cosigning required</h2>
      <p>
        You can start the cosigning immediately by clicking the button below.
      </p>
      <p>
        <a href="./start-cosign">
          <button type="button" class="utrecht-button utrecht-button--primary-action">
            Cosign now
          </button>
        </a>
      </p>
      <h3>Alternative instructions</h3>
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
            visible: true,
          },
        ],
      }),
    },
    reactRouter: {
      location: {state: {}},
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Submission completed',
};

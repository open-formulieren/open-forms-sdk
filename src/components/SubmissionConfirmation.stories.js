import {BASE_URL} from 'api-mocks';
import {buildForm} from 'api-mocks';
import {mockSubmissionProcessingStatusGet} from 'api-mocks/submissions';
import {LayoutDecorator, withCard} from 'story-utils/decorators';

import SubmissionConfirmation from './SubmissionConfirmation';

export default {
  title: 'Private API / SubmissionConfirmation',
  component: SubmissionConfirmation,
  decorators: [LayoutDecorator, withCard],
  args: {
    statusUrl: `${BASE_URL}submissions/4b0e86a8-dc5f-41cc-b812-c89857b9355b/-token-/status`,
    form: buildForm({submissionReportDownloadLinkTitle: 'Download your details as PDF'}),
  },
  argTypes: {
    statusUrl: {control: false},
    form: {control: false},
  },
  parameters: {
    msw: {
      handlers: [mockSubmissionProcessingStatusGet],
    },
  },
};

export const Success = {};

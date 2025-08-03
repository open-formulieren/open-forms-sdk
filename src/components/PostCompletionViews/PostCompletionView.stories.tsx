import type {Meta, StoryObj} from '@storybook/react';

import Body from '@/components/Body';

import PostCompletionView from './PostCompletionView';

interface Args {
  pageTitle: string;
  header: string;
  body: string;
  mainWebsiteUrl: string;
  reportDownloadUrl: string;
  downloadPDFText: string;
}

export default {
  title: 'Views / Post completion views ',
  component: PostCompletionView,
  render: ({body, ...args}) => <PostCompletionView {...args} body={<Body>{body}</Body>} />,
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Generic: Story = {
  args: {
    pageTitle: 'Confirmation',
    header: 'Confirmation!',
    body: 'This is some text for the body',
    mainWebsiteUrl: '#',
    reportDownloadUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
};

import type {Meta, StoryObj} from '@storybook/react';

import Body from '@/components/Body';

import PostCompletionView from './PostCompletionView';

export default {
  title: 'Views / Post completion views ',
  component: PostCompletionView,
  render: ({body, ...args}) => <PostCompletionView {...args} body={<Body>{body}</Body>} />,
} satisfies Meta<typeof PostCompletionView>;

type Story = StoryObj<typeof PostCompletionView>;

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

export const WithBackToTopButton: Story = {
  args: {
    pageTitle: 'Confirmation',
    header: 'Confirmation!',
    body: 'This is some text for the body',
    mainWebsiteUrl: '#',
    reportDownloadUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
  parameters: {
    config: {backToTopText: 'Back to top', backToTopRef: 'storybook-root'},
  },
};

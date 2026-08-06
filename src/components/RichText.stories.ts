import type {Meta, StoryObj} from '@storybook/react-vite';

import RichText from './RichText';

export default {
  title: 'Pure React Components / RichText',
  component: RichText,
  // decorators: [withPageWrapper],
} satisfies Meta<typeof RichText>;

type Story = StoryObj<typeof RichText>;

// Examples taken and adapted from https://cure53.de/purify

export const SimpleHTML: Story = {
  args: {
    content: `
      <article>
        <h2>Hello</h2>
        <p>This is <em>harmless</em> rich text with <a href="https://github.com/cure53/DOMPurify">a link</a>.</p>
      </article>
    `,
  },
};

export const CSPPostProcessedHTML: Story = {
  args: {
    content: `
      <style nonce="dGVzdA==">
        #nonce-5fa62ae6176f3746142503a6ebe96cb3-1234 {
          font-size: 12px;
          color: red;
        }
      </style>
      <div>
        <p>Some unstyled content</p>
        <p>Some <strong><span id="nonce-5fa62ae6176f3746142503a6ebe96cb3-1234">styled</span></strong> content.</p>
      </div>
  `,
  },
};

export const DangerousContentWithXSS: Story = {
  args: {
    content: `<p><script>alert('XSS!');</script>If you get an alert, it's broken.</p>`,
  },
};

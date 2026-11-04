import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

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
        <p>This is <em>harmless</em> rich text with <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener">a link</a>.</p>
      </article>
    `,
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    // #6890 - Validate that the target attribute is present
    const link = canvas.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
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

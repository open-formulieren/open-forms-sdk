import type {Meta, StoryObj} from '@storybook/react-vite';

import FormHelpContent from './FormHelpContent';

export default {
  title: 'Private API / FormHelpContent',
  component: FormHelpContent,
} satisfies Meta<typeof FormHelpContent>;

type Story = StoryObj<typeof FormHelpContent>;

export const PlainText: Story = {
  args: {
    content: `Plain text renders just fine.`,
  },
};

export const RichText: Story = {
  args: {
    content: `
      <p>Rich text <strong>supports</strong> some <em>markup</em>.</p>
      <ul>
        <li>Like <b>bold</b></li>
        <li>and <i>italic</i></li>
      </ul>

      <ol>
        <li>Unordered lists</li>
        <li>and ordered lists</li>
        <li>or <a href="#" target="_blank" rel="noopener">links</a>
      </ol>

      <dialog open>But other HTML is defused.</dialog>
    `,
  },
};

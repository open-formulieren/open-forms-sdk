import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {fn} from 'storybook/test';

import {FormHelpButton} from '../FormHelpButton';
import PreviousLink from '../PreviousLink';
import FormStepTopNav from './FormStepTopNav';

export default {
  title: 'Private API / FormStep / FormStepTopNav',
  component: FormStepTopNav,
  argTypes: {
    children: {table: {disable: true}},
  },
} satisfies Meta<typeof FormStepTopNav>;

type Story = StoryObj<typeof FormStepTopNav>;

export const HelpButtonOnly: Story = {
  args: {
    children: <FormHelpButton onClick={fn()} />,
  },
};

export const PreviousLinkAndHelpButton: Story = {
  decorators: [
    Story => (
      <div style={{'--of-previous-link-display-start': 'block'}}>
        <Story />
      </div>
    ),
    withRouter,
  ],
  args: {
    children: (
      <>
        <PreviousLink to="/" position="start" linkText="Previous" />
        <FormHelpButton onClick={fn()} />
      </>
    ),
  },
};

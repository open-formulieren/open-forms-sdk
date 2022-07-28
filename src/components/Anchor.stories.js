import React from 'react';

import Anchor, {ANCHOR_MODIFIERS} from './Anchor';

export default {
  title: 'SDK/Base components/Anchor',
  component: Anchor,
  argTypes: {
    modifiers: {
      control: {
        type: 'check',
        options: ANCHOR_MODIFIERS,
      }
    },
    children: {control: false},
    onClick: {control: false},
  },
  parameters: {controls: {sort: 'requiredFirst'}},
};

const Template = ({label, ...args}) => <Anchor href="https://example.com" {...args}>{label}</Anchor>;

export const Default = Template.bind({});
Default.args = {
  label: 'Anchor/link',
};

export const Hover = Template.bind({});
Hover.args = {
  modifiers: ['hover'],
  label: 'Hover modifier',
};

export const Active = Template.bind({});
Active.args = {
  modifiers: ['active'],
  label: 'Active modifier',
};

export const Muted = Template.bind({});
Muted.args = {
  modifiers: ['muted'],
  label: 'Muted modifier',
};

export const Indent = Template.bind({});
Indent.args = {
  modifiers: ['indent'],
  label: 'Indent modifier',
};

export const CustomComponent = Template.bind({});
CustomComponent.args = {
  component: 'span',
  label: 'Replace the a tag with a component of choice',
};

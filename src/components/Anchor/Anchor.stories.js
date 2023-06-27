import Anchor, {ANCHOR_MODIFIERS} from '.';

export default {
  title: 'Pure React components / Anchor',
  component: Anchor,
  argTypes: {
    modifiers: {
      options: ANCHOR_MODIFIERS,
      control: {
        type: 'check',
      },
    },
    children: {control: false},
    onClick: {control: false},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

const render = ({label, ...args}) => (
  <Anchor href="https://example.com" {...args}>
    {label}
  </Anchor>
);

export const Default = {
  render,
  args: {
    label: 'Anchor/link',
  },
};

export const Hover = {
  render,
  args: {
    modifiers: ['hover'],
    label: 'Hover',
  },
};

export const Active = {
  render,
  args: {
    modifiers: ['active'],
    label: 'Active',
  },
};

export const Muted = {
  render,
  args: {
    modifiers: ['muted'],
    label: 'Muted',
  },
};

export const Indent = {
  render,
  args: {
    modifiers: ['indent'],
    label: 'Indent',
  },
};

export const Inherit = {
  render,
  args: {
    modifiers: ['inherit'],
    label: 'Inherit',
  },
};

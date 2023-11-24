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

/**
 * A placeholder link indicating that the link may become available.
 *
 * The link is currently not active/clickable/enabled because of some state, but
 * depending on context it may become a regular link. The `href` attribute is removed,
 * which removes the link from the tab/focus navigation while keeping a consistent
 * markup.
 */
export const Placeholder = {
  render,
  args: {
    label: 'placeholder',
    placeholder: true,
  },
};

/**
 * A link indicating the current page.
 *
 * Typically you can navigate to this link, but it will just take you to the same page.
 * While the link is enabled and can be clicked, the styling does not *encourage* users
 * to click it by rendering the default cursor instead.
 */
export const Current = {
  render,
  args: {
    modifiers: ['current'],
    label: 'Current',
  },
};

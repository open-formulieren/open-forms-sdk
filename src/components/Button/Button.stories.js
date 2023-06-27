import {default as AnchorComponent} from 'components/Anchor';
import Button, {VARIANTS} from 'components/Button';
import FAIcon from 'components/FAIcon';

export default {
  title: 'Pure React components / Button',
  component: Button,
  argTypes: {
    variant: {
      options: VARIANTS,
      control: {
        type: 'radio',
      },
    },
    extraVariants: {
      type: {name: 'array'},
    },
    children: {table: {disable: true}},
    onDisabledClick: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

const render = ({label, ...args}) => <Button {...args}>{label}</Button>;

export const ExtraProps = {
  name: 'Extra props',
  render,
  args: {
    title: 'Title attribute',
    label: 'Hover me',
  },
};

export const Default = {
  render,
  args: {label: 'Default'},
};

export const Primary = {
  render,
  args: {
    label: 'Primary',
    variant: 'primary',
  },
};

export const Secondary = {
  render,
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
};

export const Danger = {
  render,
  args: {
    label: 'Danger',
    variant: 'danger',
  },
};

export const Anchor = {
  render,
  args: {
    label: 'UtrechtButton',
    variant: 'anchor',
  },
};

export const AnchorButton = {
  name: 'Anchor/button',
  render,
  args: {
    label: 'button tag',
    variant: 'anchor',
    component: 'button',
  },
};

export const AnchorA = {
  name: 'Anchor/a',
  render,
  args: {
    label: 'anchor tag',
    variant: 'anchor',
    component: 'a',
    href: '#',
  },
};

export const IconOnly = {
  name: 'Icon only',
  args: {
    title: 'Icon only',
    variant: 'icon-only',
    icon: 'pen',
  },
  render: ({icon, ...args}) => (
    <Button {...args}>
      <FAIcon icon={icon} />
    </Button>
  ),
};

export const IconOnlyDanger = {
  name: 'Icon only danger',
  render: IconOnly.render,
  args: {
    ...IconOnly.args,
    title: 'Icon only danger',
    variant: 'icon-only',
    extraVariants: ['danger'],
  },
};

export const Disabled = {
  render,
  args: {
    label: 'Button',
    disabled: true,
    onDisabledClick: () => alert('clicked disabled button'),
  },
};

export const CustomComponent = {
  render,
  args: {
    label: 'Button',
    component: 'div',
    value: 'div element',
  },
};

export const Link = {
  render,
  args: {
    label: 'Link',
    component: AnchorComponent,
  },
};

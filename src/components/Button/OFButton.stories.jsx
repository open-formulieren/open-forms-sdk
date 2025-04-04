import {LinkButton} from '@utrecht/component-library-react';

import FAIcon from '../FAIcon';
import OFButton from './OFButton';

export default {
  title: 'Pure React components / OF Button',
  component: OFButton,
  argTypes: {
    children: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

const render = ({label, component: ButtonComponent, ...args}) => {
  return <ButtonComponent {...args}>{label}</ButtonComponent>;
};

export const UtrechtDefault = {
  render,
  args: {
    label: 'Default',
    component: OFButton,
  },
};

export const UtrechtPrimary = {
  render,
  args: {
    label: 'Primary',
    component: OFButton,
    variant: 'primary',
  },
};

export const UtrechtSecondary = {
  render,
  args: {
    label: 'Secondary',
    component: OFButton,
    variant: 'secondary',
  },
};

export const UtrechtDanger = {
  render,
  args: {
    label: 'Danger',
    component: OFButton,
    variant: 'primary',
    hint: 'danger',
  },
};

export const UtrechtButtonLooksLikeLink = {
  render,
  args: {
    label: 'Link-like button',
    component: LinkButton,
  },
};

export const UtrechtIconButton = {
  render,
  args: {
    label: <FAIcon icon={'pen'} />,
    component: OFButton,
    appearance: 'subtle-button',
  },
};

export const UtrechtIconButtonDanger = {
  render,
  args: {
    label: <FAIcon icon={'pen'} />,
    component: OFButton,
    appearance: 'subtle-button',
    hint: 'danger',
  },
};

export const UtrechtButtonDisabled = {
  render,
  args: {
    label: 'Disabled',
    component: OFButton,
    variant: 'primary',
    disabled: true,
  },
};

import {
  ButtonLink as UtrechtButtonLink,
  LinkButton as UtrechtLinkButton,
} from '@utrecht/component-library-react';
import React from 'react';

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

const render = ({label, component, ...args}) => {
  const ButtonComponent = component;
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
    appearance: 'primary-action-button',
  },
};

export const UtrechtSecondary = {
  render,
  args: {
    label: 'Secondary',
    component: OFButton,
    appearance: 'secondary-action-button',
  },
};

export const UtrechtDanger = {
  render,
  args: {
    label: 'Danger',
    component: OFButton,
    appearance: 'primary-action-button',
    hint: 'danger',
  },
};

export const UtrechtLinkLooksLikeDefaultButton = {
  render,
  args: {
    label: 'Default',
    component: UtrechtButtonLink,
    href: '#',
  },
};

export const UtrechtLinkLooksLikePrimaryButton = {
  render,
  args: {
    label: 'Primary',
    component: UtrechtButtonLink,
    href: '#',
    appearance: 'primary-action-button',
  },
};

export const UtrechtLinkLooksLikeSecondaryButton = {
  render,
  args: {
    label: 'Secondary',
    component: UtrechtButtonLink,
    href: '#',
    appearance: 'secondary-action-button',
  },
};

export const UtrechtLinkLooksLikeDangerButton = {
  render,
  args: {
    label: 'Danger',
    component: UtrechtButtonLink,
    href: '#',
    appearance: 'primary-action-button',
    hint: 'danger',
  },
};

export const UtrechtButtonLooksLikeLink = {
  render,
  args: {
    label: 'Link-like button',
    component: UtrechtLinkButton,
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
    appearance: 'primary-action-button',
    disabled: true,
  },
};

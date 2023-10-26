import {
  Button as UtrechtButton,
  ButtonLink as UtrechtButtonLink,
  LinkButton as UtrechtLinkButton,
} from '@utrecht/component-library-react';
import React from 'react';

import FAIcon from '../FAIcon';
import Loader from '../Loader';
import ButtonWithAccessibleDisabledState from './ButtonWithAccessibleDisabledState';

export default {
  title: 'Pure React components / Utrecht Button',
  component: UtrechtButton,
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
    component: UtrechtButton,
  },
};

export const UtrechtPrimary = {
  render,
  args: {
    label: 'Primary',
    component: UtrechtButton,
    appearance: 'primary-action-button',
  },
};

export const UtrechtSecondary = {
  render,
  args: {
    label: 'Secondary',
    component: UtrechtButton,
    appearance: 'secondary-action-button',
  },
};

export const UtrechtDanger = {
  render,
  args: {
    label: 'Danger',
    component: UtrechtButton,
    appearance: 'primary-action-button',
    hint: 'danger',
  },
};

export const UtrechtLinkLooksLikeDefaultButton = {
  render,
  args: {
    label: 'Default',
    component: UtrechtButtonLink,
  },
};

export const UtrechtLinkLooksLikePrimaryButton = {
  render,
  args: {
    label: 'Primary',
    component: UtrechtButtonLink,
    appearance: 'primary-action-button',
  },
};

export const UtrechtLinkLooksLikeSecondaryButton = {
  render,
  args: {
    label: 'Secondary',
    component: UtrechtButtonLink,
    appearance: 'secondary-action-button',
  },
};

export const UtrechtLinkLooksLikeDangerButton = {
  render,
  args: {
    label: 'Danger',
    component: UtrechtButtonLink,
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
    component: UtrechtButton,
    appearance: 'subtle-button',
  },
};

export const UtrechtIconButtonDanger = {
  render,
  args: {
    label: <FAIcon icon={'pen'} />,
    component: UtrechtButton,
    appearance: 'subtle-button',
    hint: 'danger',
  },
};

export const UtrechtButtonDisabled = {
  render,
  args: {
    label: 'Disabled',
    component: ButtonWithAccessibleDisabledState,
    appearance: 'primary-action-button',
    disabled: true,
  },
};

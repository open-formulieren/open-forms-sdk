import React from 'react';

import Anchor from './Anchor';

export default {
  title: 'SDK/Base components/Anchor',
  component: Anchor,
};

export const Hover = () => <Anchor modifiers={['hover']}>Anchor with hover</Anchor>
export const Active = () => <Anchor modifiers={['active']}>Active</Anchor>
export const Muted = () => <Anchor modifiers={['muted']}>Muted</Anchor>
export const Indent = () => <Anchor modifiers={['indent']}>Indent</Anchor>
export const Span = () => <Anchor component="span">Span instead of 'a' tag</Anchor>

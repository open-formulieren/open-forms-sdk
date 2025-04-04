import {ButtonLink, Link} from '@utrecht/component-library-react';
import type {LinkProps} from '@utrecht/component-library-react/dist/Link';
import clsx from 'clsx';

export const ANCHOR_MODIFIERS = [
  // maps to NLDS
  'current',
  // OF specific
  'hover',
  'inherit',
] as const;

export interface AnchorProps extends LinkProps {
  modifiers?: (typeof ANCHOR_MODIFIERS)[number][];
  component?: typeof Link | typeof ButtonLink;
}

const Anchor: React.FC<AnchorProps> = ({
  children,
  href,
  modifiers = [],
  className,
  component: LinkComponent = Link,
  ...props
}) => {
  // extend with our own modifiers
  className = clsx(
    'utrecht-link--html-a',
    'utrecht-link--openforms', // always apply our own modifier
    className,
    {
      'utrecht-link--current': modifiers.includes('current'),
      'utrecht-link--openforms-hover': modifiers.includes('hover'),
      'utrecht-link--openforms-inherit': modifiers.includes('inherit'),
    }
  );
  return (
    <LinkComponent className={className} href={href || undefined} {...props}>
      {children}
    </LinkComponent>
  );
};

export default Anchor;

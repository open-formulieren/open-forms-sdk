import {ButtonLink, Link} from '@utrecht/component-library-react';
import clsx from 'clsx';

export const ANCHOR_MODIFIERS = [
  // maps to NLDS
  'current',
  // OF specific
  'hover',
  'inherit',
] as const;

type Variant = (typeof ANCHOR_MODIFIERS)[number];

interface AnchorLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  as?: 'link';
  modifiers?: Variant[];
}

interface AnchorButtonLinkProps extends React.ComponentPropsWithoutRef<typeof ButtonLink> {
  as: 'button-link';
  modifiers?: never;
}

export type AnchorProps = AnchorLinkProps | AnchorButtonLinkProps;

const getLinkComponent = (renderAs: NonNullable<AnchorProps['as']>): React.ElementType => {
  switch (renderAs) {
    case 'link':
      return Link;
    case 'button-link':
      return ButtonLink;
    default: {
      const exhaustiveCheck: never = renderAs;
      throw new Error(`Unknown 'as' value: ${exhaustiveCheck}`);
    }
  }
};

const Anchor: React.FC<AnchorProps> = ({
  children,
  href,
  className,
  as: renderAs = 'link',
  ...props
}: AnchorProps) => {
  const LinkComponent = getLinkComponent(renderAs);
  const isRegularLink = renderAs === 'link';
  const modifiers: Variant[] = props.modifiers ?? [];

  // extend with our own modifiers
  className = clsx(className, {
    'utrecht-link--html-a': isRegularLink,
    'utrecht-link--openforms': isRegularLink,
    'utrecht-link--current': modifiers.includes('current'),
    'utrecht-link--openforms-hover': modifiers.includes('hover'),
    'utrecht-link--openforms-inherit': modifiers.includes('inherit'),
  });
  return (
    <LinkComponent className={className} href={href || undefined} {...props}>
      {children}
    </LinkComponent>
  );
};

export default Anchor;

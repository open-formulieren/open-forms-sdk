import React from 'react';
import {type LinkProps as RouterLinkProps, useHref, useLinkClickHandler} from 'react-router';

import Anchor, {type AnchorProps} from '@/components/Anchor';

export interface LinkProps extends RouterLinkProps {
  placeholder?: boolean;
}

/**
 * Custom Link component using the design system component, replacing react-router's Link.
 */
const Link: React.FC<LinkProps & AnchorProps> = ({
  onClick,
  placeholder,
  replace = false,
  state,
  target,
  to,
  ...rest
}) => {
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
  });
  return (
    <Anchor
      {...rest}
      href={href}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        if (placeholder) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) {
          handleClick(event);
        }
      }}
      target={target}
      placeholder={placeholder}
    />
  );
};

Link.displayName = 'Link';

export default Link;

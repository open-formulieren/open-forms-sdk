import React from 'react';
import {useHref, useLinkClickHandler} from 'react-router-dom';

import Anchor from 'components/Anchor';

/**
 * Custom Link component using the design system component, replacing react-router's Link.
 */
const Link = React.forwardRef(
  ({onClick, placeholder, replace = false, state, target, to, ...rest}, ref) => {
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
        onClick={event => {
          if (placeholder) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
          if (!event.defaultPrevented) {
            handleClick(event);
          }
        }}
        ref={ref}
        target={target}
        placeholder={placeholder}
      />
    );
  }
);

Link.displayName = 'Link';

// Prop types deliberately unspecified, please use the typescript definitions of
// react-router-dom instead.

export default Link;

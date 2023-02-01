import {Link as UtrechtLink} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export const ANCHOR_MODIFIERS = ['hover', 'active', 'inherit', 'muted', 'indent'];

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const Anchor = ({children, href, modifiers = [], ...extra}) => {
  // extend with our own modifiers
  const className = classNames(
    'utrecht-link--openforms', // always apply our own modifier
    ...modifiers.map(mod => `utrecht-link--openforms-${mod}`)
  );

  const {navigate, ...rest} = extra; // workaround for https://github.com/ReactTraining/react-router/issues/6962
  const extraProps = {...rest};
  if (href) {
    extraProps.href = href;
  }

  // restore the LinkAnchor behaviour from react-router, see
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/Link.js
  if (navigate) {
    const onClick = event => {
      try {
        if (extra.onClick) extra.onClick(event);
      } catch (ex) {
        event.preventDefault();
        throw ex;
      }

      const {target} = extraProps;
      if (
        !event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore everything but left clicks
        (!target || target === '_self') && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault();
        navigate();
      }
    };
    extraProps.onClick = onClick;
  }

  return (
    <UtrechtLink className={className} {...extraProps}>
      {children}
    </UtrechtLink>
  );
};

Anchor.propTypes = {
  href: PropTypes.string,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(ANCHOR_MODIFIERS)),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onClick: PropTypes.func,
};

export default Anchor;

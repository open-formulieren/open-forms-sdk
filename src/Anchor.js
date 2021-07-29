import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}


const Anchor = ({ children, href, modifiers=[], component='a', ...extra }) => {
  const Component = `${component}`;
  const className = getBEMClassName('anchor', modifiers);
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
        (!target || target === "_self") && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault();
        navigate();
      }
    }
    extraProps.onClick = onClick;
  }

  return (
    <Component className={className} {...extraProps}>{children}</Component>
  );
};

Anchor.propTypes = {
    href: PropTypes.string,
    modifiers: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    component: PropTypes.string,
};


export default Anchor;

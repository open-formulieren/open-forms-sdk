import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {getBEMClassName} from 'utils';

export const MODIFIERS = ['centered', 'only-child', 'small', 'gray'];

const Loader = ({modifiers = [], withoutTranslation}) => {
  const className = getBEMClassName('loading', modifiers);
  return (
    <div className={className} role="status">
      <span className={getBEMClassName('loading__spinner')} />
      <span className="sr-only">
        {withoutTranslation ? (
          'Loading...'
        ) : (
          <FormattedMessage description="Loading content text" defaultMessage="Loading..." />
        )}
      </span>
    </div>
  );
};

Loader.propTypes = {
  withoutTranslation: PropTypes.bool,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(MODIFIERS)),
};

export default Loader;

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Main application display component - this is the layout wrapper around content.
 *
 * The Display component uses 'slots' for certain content blocks. The slot 'children'
 * is reserved for the main content.
 *
 */
export const AppDisplay = ({
  children = null,
  languageSwitcher = null,
  progressIndicator = null,
  appDebug = null,
  router,
}) => (
  <div
    className={classNames('openforms-app', {
      'openforms-app--no-progress-indicator': !progressIndicator,
      'openforms-app--no-language-switcher': !languageSwitcher,
    })}
  >
    {languageSwitcher && <div className="openforms-app__language-switcher">{languageSwitcher}</div>}
    <div className="openforms-app__body">{children || router}</div>
    {progressIndicator && (
      <div className="openforms-app__progress-indicator">{progressIndicator}</div>
    )}
    {appDebug && <div className="openforms-app__debug">{appDebug}</div>}
  </div>
);

AppDisplay.propTypes = {
  children: PropTypes.node.isRequired,
  languageSwitcher: PropTypes.node,
  progressIndicator: PropTypes.node,
  appDebug: PropTypes.node,
  /**
   * Main content.
   *
   * @deprecated Use children instead.
   *
   */
  router: PropTypes.node,
};

export default AppDisplay;

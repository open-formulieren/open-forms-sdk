import PropTypes from 'prop-types';
import React from 'react';

const AppDisplay = ({router, languageSwitcher = null, appDebug = null}) => (
  <div className="openforms-app">
    {languageSwitcher && <div className="openforms-app__language-switcher">{languageSwitcher}</div>}
    <div className="openforms-app__body">{router}</div>
    {appDebug && <div className="openforms-app__debug">{appDebug}</div>}
  </div>
);

AppDisplay.propTypes = {
  router: PropTypes.node.isRequired,
  languageSwitcher: PropTypes.node,
  appDebug: PropTypes.node,
};

export default AppDisplay;

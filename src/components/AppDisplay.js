import PropTypes from 'prop-types';
import React from 'react';

import {Layout, LayoutRow} from 'components/Layout';

const AppDisplay = ({router, languageSwitcher = null, appDebug = null}) => {
  return (
    <Layout>
      {languageSwitcher}
      <LayoutRow>{router}</LayoutRow>
      {appDebug ? <LayoutRow>{appDebug}</LayoutRow> : null}
    </Layout>
  );
};

AppDisplay.propTypes = {
  router: PropTypes.element.isRequired,
  languageSwitcher: PropTypes.element,
  appDebug: PropTypes.element,
};

export default AppDisplay;

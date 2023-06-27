import PropTypes from 'prop-types';
import React from 'react';

import {Layout, LayoutRow} from 'components/Layout';

const AppDisplay = ({router, languageSwitcher = null, appDebug = null}) => (
  <Layout>
    {languageSwitcher}
    <LayoutRow>{router}</LayoutRow>
    {appDebug && <LayoutRow>{appDebug}</LayoutRow>}
  </Layout>
);

AppDisplay.propTypes = {
  router: PropTypes.node.isRequired,
  languageSwitcher: PropTypes.node,
  appDebug: PropTypes.node,
};

export default AppDisplay;

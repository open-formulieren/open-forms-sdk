import {Outlet} from 'react-router';

import AnalyticsToolsConfigProvider from '@/components/analytics/AnalyticsToolConfigProvider';

import FormDisplay from './FormDisplay';

/**
 * An OpenForms single step form.
 */
const SingleStepForm: React.FC = () => {
  // render the container for the router and necessary context providers for deeply
  // nested child components
  return (
    <FormDisplay progressIndicator={false}>
      <AnalyticsToolsConfigProvider>
        <Outlet />
      </AnalyticsToolsConfigProvider>
    </FormDisplay>
  );
};

export default SingleStepForm;

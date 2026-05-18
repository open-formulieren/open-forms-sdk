import type {RouteObject} from 'react-router';

import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import SingleFormStepNewRenderer from '@/components/FormStep/SingleFormStepNewRenderer';
import {ConfirmationView} from '@/components/PostCompletionViews';

const singlePageRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <ErrorBoundary useCard>
        <SingleFormStepNewRenderer />
      </ErrorBoundary>
    ),
  },
  {
    path: 'bevestiging',
    element: (
      <ErrorBoundary useCard>
        <ConfirmationView onFailureNavigateTo="/sp" />
      </ErrorBoundary>
    ),
  },
];

export default singlePageRoutes;

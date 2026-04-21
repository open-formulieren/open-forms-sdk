import type {RouteObject} from 'react-router';

import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import {ConfirmationView} from '@/components/PostCompletionViews';
import {SessionTrackerModal} from '@/components/Sessions';

const singlePageRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <ErrorBoundary useCard>
        <SessionTrackerModal>
          <></>
        </SessionTrackerModal>
      </ErrorBoundary>
    ),
  },
  {
    path: 'bevestiging',
    element: (
      <ErrorBoundary useCard>
        <ConfirmationView onFailureNavigateTo="/:step" />
      </ErrorBoundary>
    ),
  },
];

export default singlePageRoutes;

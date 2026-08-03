import type {RouteObject} from 'react-router';

import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import FormLandingPage from '@/components/FormLandingPage';
import FormStart from '@/components/FormStart';
import FormStepNewRenderer from '@/components/FormStep/FormStepNewRenderer';
import HelpCalloutPage from '@/components/HelpCalloutPage';
import IntroductionPage from '@/components/IntroductionPage';
import {ConfirmationView, StartPaymentView} from '@/components/PostCompletionViews';
import RequireSubmission from '@/components/RequireSubmission';
import {SessionTrackerModal} from '@/components/Sessions';
import {SubmissionSummary} from '@/components/Summary';

const routes: RouteObject[] = [
  {
    path: '',
    element: <FormLandingPage />,
  },
  {
    path: 'introductie',
    element: <IntroductionPage />,
  },
  {
    path: 'startpagina',
    element: (
      <ErrorBoundary useCard>
        <FormStart />
      </ErrorBoundary>
    ),
  },
  {
    path: 'hulp',
    element: <HelpCalloutPage />,
  },
  {
    path: 'stap/:step',
    element: (
      <ErrorBoundary useCard>
        <SessionTrackerModal>
          <RequireSubmission>
            <FormStepNewRenderer />
          </RequireSubmission>
        </SessionTrackerModal>
      </ErrorBoundary>
    ),
  },
  {
    path: 'overzicht',
    element: (
      <ErrorBoundary useCard>
        <SessionTrackerModal>
          <RequireSubmission>
            <SubmissionSummary />
          </RequireSubmission>
        </SessionTrackerModal>
      </ErrorBoundary>
    ),
  },
  {
    path: 'betalen',
    element: (
      <ErrorBoundary useCard>
        <RequireSubmission>
          <StartPaymentView onFailureNavigateTo="/overzicht" />
        </RequireSubmission>
      </ErrorBoundary>
    ),
  },
  {
    path: 'bevestiging',
    element: (
      <ErrorBoundary useCard>
        <ConfirmationView onFailureNavigateTo="/overzicht" />
      </ErrorBoundary>
    ),
  },
];

export default routes;

import ErrorBoundary from 'components/Errors/ErrorBoundary';
import FormLandingPage from 'components/FormLandingPage';
import FormStart from 'components/FormStart';
import IntroductionPage from 'components/IntroductionPage';

const formRoutes = [
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
];

export default formRoutes;

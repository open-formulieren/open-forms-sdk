import FormLandingPage from 'components/FormLandingPage';
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
];

export default formRoutes;

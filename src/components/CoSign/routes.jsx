import CosignCheck from './CosignCheck';
import CosignDone from './CosignDone';
import CosignStart from './CosignStart';

const routes = [
  {
    path: 'start',
    element: <CosignStart />,
  },
  {
    path: 'check',
    element: <CosignCheck />,
  },
  {
    path: 'done',
    element: <CosignDone />,
  },
];

export default routes;

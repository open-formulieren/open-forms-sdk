import CosignDone from './CosignDone';
import CosignStart from './CosignStart';

const routes = [
  {
    path: 'start',
    element: <CosignStart />,
  },
  {
    path: 'done',
    element: <CosignDone />,
  },
];

export default routes;

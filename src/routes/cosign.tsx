import type {RouteObject} from 'react-router';

import CosignCheck from '@/components/CoSign/CosignCheck';
import CosignDone from '@/components/CoSign/CosignDone';
import CosignStart from '@/components/CoSign/CosignStart';

const routes: RouteObject[] = [
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

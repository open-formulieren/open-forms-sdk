import {useMemo} from 'react';
import {useIntl} from 'react-intl';

import {getDateLocaleMeta} from './utils';

export const useDateLocaleMeta = () => {
  const intl = useIntl();
  const meta = useMemo(() => getDateLocaleMeta(intl.locale), [intl.locale]);
  return meta;
};

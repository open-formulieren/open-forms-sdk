import {useContext} from 'react';
import {useTitle as reactUseTitle} from 'react-use';

import {ConfigContext} from '@/Context';

const useTitle = (localTitle: string, regionalTitle: string = ''): void => {
  let {baseTitle} = useContext(ConfigContext);
  baseTitle = baseTitle ? baseTitle.trim() : '';

  const titleParts = [localTitle, regionalTitle, baseTitle].filter(part => part !== '');
  return reactUseTitle(titleParts.join(' | '));
};

export default useTitle;

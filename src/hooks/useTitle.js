import {useContext} from 'react';
import {useTitle as reactUseTitle} from 'react-use';

import {ConfigContext} from 'Context';

const useTitle = localTitle => {
  let {baseTitle} = useContext(ConfigContext);
  baseTitle = baseTitle ? baseTitle.trim() : '';
  return reactUseTitle(baseTitle ? `${localTitle} | ${baseTitle}` : localTitle);
};

export default useTitle;

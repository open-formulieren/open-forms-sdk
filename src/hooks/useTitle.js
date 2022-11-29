import {useContext} from 'react';
import {useTitle as reactUseTitle} from 'react-use';
import {ConfigContext} from 'Context';

const useTitle = localTitle => {
  const {titlePrefix} = useContext(ConfigContext);
  return reactUseTitle(titlePrefix ? `${titlePrefix} | ${localTitle}` : localTitle);
};

export default useTitle;

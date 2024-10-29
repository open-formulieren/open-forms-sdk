import {useEffect} from 'react';

const useWindowResize = onResize => {
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);
};

export default useWindowResize;

import {useEffect} from 'react';

const useWindowResize = (onResize: (event: UIEvent) => void): void => {
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);
};

export default useWindowResize;

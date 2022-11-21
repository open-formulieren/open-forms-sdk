import {useRef, useEffect} from 'react';

const useScrollIntoView = (options = {behavior: 'smooth'}) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView(options);
  }, [ref, options]);
  return ref;
};

export default useScrollIntoView;

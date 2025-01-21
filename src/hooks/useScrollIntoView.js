import {useEffect, useRef} from 'react';

const useScrollIntoView = (options = {behavior: 'smooth'}) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    // scrollIntoView is not available in jest-dom, and this can cause to crashing/infinitely
    // loading (integration) tests because ErrorMessage uses this hook, which is used
    // in the usual ErrorBoundary component... So, be very conservative here with the
    // scrollIntoView behaviour/expectations!
    ref.current.scrollIntoView?.(options);
  }, [ref, options]);
  return ref;
};

export default useScrollIntoView;

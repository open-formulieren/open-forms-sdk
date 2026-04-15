import {useEffect, useRef} from 'react';

const DEFAULT_OPTIONS: ScrollIntoViewOptions = {behavior: 'smooth'};

const useScrollIntoView = <T extends HTMLElement = HTMLElement>(
  disable: boolean = false,
  options: ScrollIntoViewOptions = DEFAULT_OPTIONS
): React.MutableRefObject<T | null> => {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!ref.current || disable) return;
    // scrollIntoView is not available in jest-dom. While we no longer use it, we remain
    // very conservative with the scrollIntoView behaviour/expectations!
    ref.current.scrollIntoView?.(options);
  }, [ref, options, disable]);
  return ref;
};

export default useScrollIntoView;

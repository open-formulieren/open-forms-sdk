import {useLayoutEffect} from 'react';
import {usePrevious} from 'react-use';

// https://github.com/morewings/storybook-addon-theme-provider?tab=readme-ov-file#use-provider-component
const Provider = ({children, theme}) => {
  const {className} = theme;
  const prevClassName = usePrevious(className);

  useLayoutEffect(() => {
    const node = document.documentElement;
    if (className) {
      node.classList.add(className);
    }
    if (prevClassName && prevClassName !== className) {
      node.classList.remove(prevClassName);
    }
  }, [className, prevClassName]);
  return <>{children}</>;
};

export default Provider;

import {getBEMClassName} from '@/utils';

export type CaptionProps<T extends React.ElementType = 'caption'> = {
  children?: React.ReactNode;
  component?: T;
} & React.ComponentPropsWithoutRef<T>;

const Caption: React.FC<CaptionProps> = ({children, component, ...props}) => {
  const Component = component || 'caption';
  return (
    <Component className={getBEMClassName('caption')} {...props}>
      {children}
    </Component>
  );
};

export default Caption;

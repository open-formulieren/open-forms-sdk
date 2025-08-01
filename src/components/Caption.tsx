export type CaptionProps<T extends React.ElementType = 'caption'> = {
  children?: React.ReactNode;
  component?: T;
} & React.ComponentPropsWithoutRef<T>;

const Caption = <T extends React.ElementType = 'caption'>({
  children,
  component,
  ...props
}: CaptionProps<T>) => {
  const Component = component || 'caption';
  return (
    <Component className="openforms-caption" {...props}>
      {children}
    </Component>
  );
};

export default Caption;

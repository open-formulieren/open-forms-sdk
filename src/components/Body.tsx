import clsx from 'clsx';

export const VARIANTS = ['big', 'muted', 'small', 'wysiwyg'] as const;
export type Variant = (typeof VARIANTS)[number];

export type BodyProps<T extends React.ElementType = 'p'> = {
  children?: React.ReactNode;
  component?: T;
  modifiers?: Variant[];
} & React.ComponentPropsWithoutRef<T>;

const Body = <T extends React.ElementType = 'p'>({
  modifiers = [],
  component,
  children,
  ...props
}: BodyProps<T>) => {
  const Component = component || 'p';
  const className = clsx(
    'openforms-body',
    modifiers.map(mod => `openforms-body--${mod}`)
  );
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export default Body;

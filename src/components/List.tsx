import clsx from 'clsx';
import React from 'react';

export interface ListProps {
  children: React.ReactNode[];
  ordered?: boolean;
  extraCompact?: boolean;
  withDash?: boolean;
}

const List: React.FC<ListProps> = ({
  children,
  ordered = false,
  extraCompact = false,
  withDash = false,
}) => {
  const Component = ordered ? 'ol' : 'ul';
  const className = clsx('openforms-list', {
    'openforms-list--extra-compact': extraCompact,
    'openforms-list--dash': withDash,
  });
  // remove empty children
  const filtered = children.filter(child => !!child);
  return (
    <Component className={className}>
      {React.Children.map(filtered, child => (
        <li className="openforms-list__item">{child}</li>
      ))}
    </Component>
  );
};

export default List;

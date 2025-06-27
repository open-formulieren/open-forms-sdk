import clsx from 'clsx';

export interface FAIconProps {
  /**
   * Name of the icon.
   *
   * @link https://fontawesome.com/search?ic=free
   */
  icon: string;
  /**
   * Additional class name(s) to apply.
   */
  className?: string;
  /**
   * Set to `true`` to apply the `inline` modifier.
   */
  inline?: boolean;
  /**
   * Set to `true`` to apply the `small` modifier.
   */
  small?: boolean;
  /**
   * Set to `true`` to apply the `normal` modifier.
   */
  normal?: boolean;
  /**
   * Set to `true` to avoid the aria-hidden=true attribute being sent, revealing the
   * icon to screenreaders.
   */
  noAriaHidden?: boolean;
}

// not all icons need to be seen by assistive technologies.
const FAIcon: React.FC<FAIconProps & React.ComponentProps<'i'>> = ({
  icon,
  className: extraClassName,
  inline,
  small,
  normal,
  noAriaHidden,
  ...props
}) => {
  const className = clsx('fa', 'fas', 'fa-icon', extraClassName, {
    [`fa-${icon}`]: icon,
    'fa-icon--inline': inline,
    'fa-icon--small': small,
    'fa-icon--normal': normal,
  });
  const ariaHidden = noAriaHidden ? 'false' : 'true';
  return <i className={className} aria-hidden={ariaHidden} {...props} />;
};

export default FAIcon;

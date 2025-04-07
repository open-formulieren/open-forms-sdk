import {Button, PrimaryActionButton, SecondaryActionButton} from '@utrecht/component-library-react';
import type {ButtonProps} from '@utrecht/component-library-react/dist/Button';
import clsx from 'clsx';

export interface OFButtonProps extends ButtonProps {
  children: React.ReactNode;
  // TODO: rename to `isDisabled`
  disabled?: boolean;
  variant: 'default' | 'primary' | 'secondary';
}

// Wrap around Utrecht button so we can properly manage the disabled state in an
// accessible manner.

const resolveComponent = (variant: OFButtonProps['variant']): React.ComponentType<ButtonProps> => {
  switch (variant) {
    case 'default': {
      return Button;
    }
    case 'primary': {
      return PrimaryActionButton;
    }
    case 'secondary': {
      return SecondaryActionButton;
    }
    default: {
      const exhaustiveCheck: never = variant;
      throw new Error(`Unhandled variant: ${exhaustiveCheck}`);
    }
  }
};

/**
 * Open Forms Button that wraps around the Utrecht Button component.
 *
 * Styling/appearance/theming requires the utrecht-button design tokens to be specified.
 * We pretty much only wrap around the upstream component to handle the disabled state
 * in an accessible way.
 */
const OFButton: React.FC<OFButtonProps> = ({
  children,
  variant = 'default',
  disabled,
  onClick,
  className,
  ...props
}) => {
  const ButtonComponent = resolveComponent(variant);
  className = clsx(className, {'utrecht-button--disabled': disabled});
  return (
    <ButtonComponent
      aria-disabled={disabled}
      className={className}
      onClick={event => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};

export default OFButton;

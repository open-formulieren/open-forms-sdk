import {Button as UtrechtButton} from '@utrecht/component-library-react';
import {ButtonProps} from '@utrecht/component-library-react/dist/Button';
import clsx from 'clsx';

interface OFButtonProps extends ButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
}

// Temporary until the aria-disabled is set on the Utrecht button
const OFButton: React.FC<OFButtonProps> = ({disabled, children, ...extraProps}) => {
  const {onClick: onClickHandler, ...otherProps} = extraProps;

  otherProps.className = clsx(otherProps.className, {'utrecht-button--disabled': disabled});

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (onClickHandler) onClickHandler(event);
  };

  return (
    <UtrechtButton aria-disabled={disabled} onClick={onClick} {...otherProps}>
      {children}
    </UtrechtButton>
  );
};

export default OFButton;

import {Button} from '@open-formulieren/formio-renderer';
import type {ButtonProps} from '@utrecht/component-library-react';
import {Icon} from '@utrecht/component-library-react';
import {FormattedMessage} from 'react-intl';

import FAIcon from '@/components/FAIcon';

export type FormHelpButtonProps = Omit<ButtonProps, 'className'>;

const FormHelpButton: React.FC<FormHelpButtonProps> = props => (
  <Button className="openforms-form-help-button" {...props}>
    <FormattedMessage description="Help dialog button label text" defaultMessage="Help" />
    <Icon>
      <span className="fa-stack openforms-form-help-button__icon">
        <FAIcon icon="message" className="fa-regular fa-stack-2x" />
        <FAIcon icon="question" className="fa-stack-1x" />
      </span>
    </Icon>
  </Button>
);

export default FormHelpButton;

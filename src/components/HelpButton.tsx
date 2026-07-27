import {forwardRef} from 'react';
import {FormattedMessage} from 'react-intl';

import FAIcon from '@/components/FAIcon';

interface HelpButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const HelpButton = forwardRef<HTMLButtonElement, HelpButtonProps>(({onClick = () => {}}, ref) => {
  return (
    <button ref={ref} onClick={onClick}>
      <FormattedMessage description="Callout page help button text" defaultMessage="Help" />
      <FAIcon icon="circle-question" />
    </button>
  );
});

HelpButton.displayName = 'HelpButton';

export default HelpButton;

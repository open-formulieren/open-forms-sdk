import {FormattedMessage} from 'react-intl';

import FAIcon from '@/components/FAIcon';

interface HelpButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const HelpButton: React.FC<HelpButtonProps> = ({onClick = () => {}}) => {
  return (
    <button onClick={onClick}>
      <FormattedMessage description="Callout page help button text" defaultMessage="Help" />
      <FAIcon icon="circle-question" />
    </button>
  );
};

export default HelpButton;

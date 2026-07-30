import {FormattedMessage} from 'react-intl';

import FAIcon from '@/components/FAIcon';
import Link from '@/components/Link';

interface NextLinkProps {
  url: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NextLink: React.FC<NextLinkProps> = ({url, onClick}) => {
  return (
    <Link
      to={url}
      as="button-link"
      appearance="primary-action-button"
      className="openforms-start-link"
      onClick={onClick}
    >
      <FormattedMessage
        description="Button text for link to continue from introduction page to start page"
        defaultMessage="Continue"
      />
      <FAIcon icon="arrow-right-long" />
    </Link>
  );
};

export default NextLink;

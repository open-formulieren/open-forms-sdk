import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router';

import AbortButton from '@/components/AbortButton';

export interface ExistingSubmissionOptionsProps {
  nextPageUrl: string;
  onDestroySession: () => Promise<void>;
  isAuthenticated?: boolean;
}

const ExistingSubmissionOptions: React.FC<ExistingSubmissionOptionsProps> = ({
  nextPageUrl,
  onDestroySession,
  isAuthenticated = false,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <ButtonGroup className="openforms-form-navigation" direction="column">
        <PrimaryActionButton onClick={() => navigate(nextPageUrl)}>
          <FormattedMessage
            defaultMessage="Continue existing submission"
            description="Continue existing submission button label"
          />
        </PrimaryActionButton>
        <AbortButton onDestroySession={onDestroySession} isAuthenticated={isAuthenticated} />
      </ButtonGroup>
    </>
  );
};

export default ExistingSubmissionOptions;

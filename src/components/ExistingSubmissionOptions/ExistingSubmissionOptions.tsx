import {ButtonGroup} from '@utrecht/button-group-react';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router';

import AbortButton from '@/components/AbortButton';
import {OFButton} from '@/components/Button';
import {Form} from '@/data/forms';

export interface ExistingSubmissionOptionsProps {
  form: Form;
  onDestroySession: () => Promise<void>;
  isAuthenticated?: boolean;
}

const ExistingSubmissionOptions: React.FC<ExistingSubmissionOptionsProps> = ({
  form,
  onDestroySession,
  isAuthenticated = false,
}) => {
  const navigate = useNavigate();
  const firstStepRoute = `/stap/${form.steps[0].slug}`;
  return (
    <>
      <ButtonGroup className="utrecht-button-group--distanced" direction="column">
        <OFButton variant="primary" onClick={() => navigate(firstStepRoute)}>
          <FormattedMessage
            defaultMessage="Continue existing submission"
            description="Continue existing submission button label"
          />
        </OFButton>
        <AbortButton onDestroySession={onDestroySession} isAuthenticated={isAuthenticated} />
      </ButtonGroup>
    </>
  );
};

export default ExistingSubmissionOptions;

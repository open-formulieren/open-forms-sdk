import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router';

import AbortButton from '@/components/AbortButton';
import type {Form} from '@/data/forms';

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
      <ButtonGroup className="openforms-form-navigation" direction="column">
        <PrimaryActionButton onClick={() => navigate(firstStepRoute)}>
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

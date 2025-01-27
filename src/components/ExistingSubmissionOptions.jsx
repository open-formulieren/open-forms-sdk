import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router';

import AbortButton from 'components/AbortButton';
import {OFButton} from 'components/Button';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Types from 'types';

const ExistingSubmissionOptions = ({form, onDestroySession, isAuthenticated}) => {
  const navigate = useNavigate();

  const firstStepRoute = `/stap/${form.steps[0].slug}`;

  return (
    <Toolbar modifiers={['column']}>
      <ToolbarList>
        <OFButton appearance="primary-action-button" onClick={() => navigate(firstStepRoute)}>
          <FormattedMessage
            defaultMessage="Continue existing submission"
            description="Continue existing submission button label"
          />
        </OFButton>
      </ToolbarList>
      <ToolbarList>
        <AbortButton onDestroySession={onDestroySession} isAuthenticated={isAuthenticated} />
      </ToolbarList>
    </Toolbar>
  );
};

ExistingSubmissionOptions.propTypes = {
  form: Types.Form.isRequired,
  onDestroySession: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

export default ExistingSubmissionOptions;

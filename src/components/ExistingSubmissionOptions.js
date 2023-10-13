import {Button as UtrechtButton} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {Toolbar, ToolbarList} from 'components/Toolbar';
import Types from 'types';

const ExistingSubmissionOptions = ({form, onFormAbort}) => {
  const navigate = useNavigate();

  const firstStepRoute = `/stap/${form.steps[0].slug}`;

  return (
    <Toolbar modifiers={['column']}>
      <ToolbarList>
        <UtrechtButton appearance="primary-action-button" onClick={() => navigate(firstStepRoute)}>
          <FormattedMessage
            defaultMessage="Continue existing submission"
            description="Continue existing submission button label"
          />
        </UtrechtButton>
      </ToolbarList>
      <ToolbarList>
        <UtrechtButton appearance="primary-action-button" hint="danger" onClick={onFormAbort}>
          <FormattedMessage
            defaultMessage="Abort existing submission"
            description="Abort existing submission button label"
          />
        </UtrechtButton>
      </ToolbarList>
    </Toolbar>
  );
};

ExistingSubmissionOptions.propTypes = {
  form: Types.Form.isRequired,
  onFormAbort: PropTypes.func.isRequired,
};

export default ExistingSubmissionOptions;

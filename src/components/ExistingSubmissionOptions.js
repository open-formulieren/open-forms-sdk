import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {OFButton} from 'components/Button';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Types from 'types';

const ExistingSubmissionOptions = ({form, onDestroySession}) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const firstStepRoute = `/stap/${form.steps[0].slug}`;
  const confirmationMessage = intl.formatMessage({
    description: 'Abort confirmation prompt',
    defaultMessage:
      'Are you sure that you want to abort this submission? You will lose your progress if you continue.',
  });

  const onFormAbort = async event => {
    event.preventDefault();

    if (!window.confirm(confirmationMessage)) return;

    await onDestroySession();
  };

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
        <OFButton appearance="primary-action-button" hint="danger" onClick={onFormAbort}>
          <FormattedMessage
            defaultMessage="Abort existing submission"
            description="Abort existing submission button label"
          />
        </OFButton>
      </ToolbarList>
    </Toolbar>
  );
};

ExistingSubmissionOptions.propTypes = {
  form: Types.Form.isRequired,
  onDestroySession: PropTypes.func.isRequired,
};

export default ExistingSubmissionOptions;

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useHistory} from 'react-router-dom';

import Button from 'components/Button';
import Types from 'types';
import {getBEMClassName} from 'utils';

const ExistingSubmissionOptions = ({form, onFormAbort}) => {
  const history = useHistory();

  const firstStepRoute = `/stap/${form.steps[0].slug}`;

  return (
    <div className={getBEMClassName('login-options')}>
      <div className={getBEMClassName('login-options__list')}>
        <div className={getBEMClassName('login-button')}>
          <Button
            variant="primary"
            onClick={() => {
              history.push(firstStepRoute);
            }}
          >
            <FormattedMessage
              defaultMessage="Continue existing submission"
              description="Continue existing submission button label"
            />
          </Button>
        </div>
        <div className={getBEMClassName('login-button')}>
          <Button variant="danger" onClick={onFormAbort}>
            <FormattedMessage
              defaultMessage="Abort existing submission"
              description="Abort existing submission button label"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

ExistingSubmissionOptions.propTypes = {
  form: Types.Form.isRequired,
  onFormAbort: PropTypes.func.isRequired,
};

export default ExistingSubmissionOptions;

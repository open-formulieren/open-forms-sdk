import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useHistory} from 'react-router-dom';

import Button from 'components/Button';
import {getBEMClassName} from 'utils';

const ExistingSubmissionOptions = ({form}) => {
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
          <Button
            variant="danger"
            onClick={() => {
              console.log('TODO');
            }}
          >
            <FormattedMessage
              defaultMessage="Abandon existing submission"
              description="Abandon existing submission button label"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExistingSubmissionOptions;

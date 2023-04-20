import {ErrorBoundary} from '@sentry/react';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {useAsync} from 'react-use';

import {apiCall, get, post} from '../../api';
import useStartSubmission from '../../hooks/useStartSubmission';
import Button from '../Button';
import Card from '../Card';
import FormStepSummary from '../FormStepSummary';
import {LayoutColumn} from '../Layout';
import Loader from '../Loader';
import LoginOptionsDisplay from '../LoginOptions/LoginOptionsDisplay';
import {getLoginUrl} from '../utils';

const CoSignLayout = ({title, children}) => {
  return (
    <ErrorBoundary useCard>
      <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>
        <Card title={title}>{children}</Card>
      </LayoutColumn>
    </ErrorBoundary>
  );
};

const CosignLogin = ({form}) => {
  const doStart = useStartSubmission();
  const history = useHistory();

  let loginAsYourselfOptions = [];
  form.cosignLoginOptions.forEach(option => {
    let readyOption = {...option};
    readyOption.url = getLoginUrl(option);
    readyOption.label = (
      <FormattedMessage
        description="Login button label"
        defaultMessage="Login with {provider}"
        values={{provider: option.label}}
      />
    );
    loginAsYourselfOptions.push(readyOption);
  });

  if (doStart) {
    history.push('/cosign/retrieve');
  }

  return (
    <CoSignLayout
      title={
        <FormattedMessage
          description="Log in to cosign page title"
          defaultMessage="Log in to co-sign {formName}"
          values={{formName: form.name}}
        />
      }
    >
      <FormattedMessage
        description="Log in to cosign page description"
        defaultMessage="Please log in in order to review and co-sign this form. You will need a code that you received via email to retrieve the submission."
      />
      <LoginOptionsDisplay
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={[]}
      />
    </CoSignLayout>
  );
};

const CosignRetrieveSubmission = ({form}) => {
  const history = useHistory();

  let postUrl = new URL(form.url);
  postUrl.pathname = '/api/v2/submissions/retrieve-submission-for-cosign';

  // TODO Get the cookie properly
  const {loading} = useAsync(async () => {
    await apiCall(form.url, {});
  }, []);

  if (loading) {
    return (
      <LayoutColumn>
        <Loader modifiers={['centered']} />
      </LayoutColumn>
    );
  }

  const onSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let dataForSubmission = {};
    for (const pair of formData.entries()) {
      dataForSubmission[pair[0]] = pair[1];
    }
    const response = await post(postUrl, dataForSubmission);
    const submissionData = response.data;
    history.push(`/cosign/${submissionData.id}`);
  };

  return (
    <CoSignLayout
      title={
        <FormattedMessage
          description="Retrieve submission page title"
          defaultMessage="Retrieve submission"
        />
      }
    >
      <form onSubmit={onSubmit}>
        <div style={{display: 'flex'}}>
          <input type="hidden" name="form_slug" value={form.slug} />
          <label>
            <FormattedMessage
              description="Retrieve submission label"
              defaultMessage="Retrieval code"
            />
          </label>
          <input
            id="submission_reference_code"
            name="submission_reference_code"
            className="openforms-input utrecht-textbox utrecht-textbox--html-input"
            type="text"
          />
          <Button type="submit" variant="primary">
            Go
          </Button>
        </div>
      </form>
    </CoSignLayout>
  );
};

const CosignCheck = ({form}) => {
  const history = useHistory();
  const submissionMatch = useRouteMatch('/cosign/:submission');

  let submissionUrl = new URL(form.url);
  submissionUrl.pathname = `/api/v2/submissions/${submissionMatch.params.submission}`;

  const {loading, value: summaryData} = useAsync(async () => {
    return await get(`${submissionUrl.href}/summary`);
  }, []);

  if (loading) {
    return (
      <LayoutColumn>
        <Loader modifiers={['centered']} />
      </LayoutColumn>
    );
  }

  const onSubmit = async event => {
    event.preventDefault();

    await post(`${submissionUrl.href}/cosign`);

    history.push('/cosign/done');
  };

  return (
    <CoSignLayout
      title={
        <FormattedMessage
          description="Co-sign summary page title"
          defaultMessage="Check and co-sign"
        />
      }
    >
      {summaryData.map((step, index) => (
        <FormStepSummary key={index} slug={step.slug} name={step.name} data={step.data} />
      ))}
      <form onSubmit={onSubmit}>
        <Button type="submit" variant="primary">
          Co-sign
        </Button>
      </form>
    </CoSignLayout>
  );
};

const CosignDone = ({form}) => {
  return (
    <CoSignLayout
      title={
        <FormattedMessage
          description="Cosign complete page title"
          defaultMessage="Co-signing complete!"
        />
      }
    >
      <FormattedMessage
        description="Text co-sign complete."
        defaultMessage="Thank you for co-signing form {formName}. You will receive a confirmation email."
        values={{formName: form.name}}
      />
    </CoSignLayout>
  );
};

export {CosignLogin, CosignRetrieveSubmission, CosignCheck, CosignDone};

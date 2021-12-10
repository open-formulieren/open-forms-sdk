import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useAsync} from 'react-use';
import {FormattedMessage} from 'react-intl';

import { get } from 'api';
import Body from 'components/Body';
import ErrorMessage from 'components/ErrorMessage';
import Loader from 'components/Loader';
import LoginButton, {LoginButtonIcon} from 'components/LoginButton';
import {ConfigContext, SubmissionContext} from 'Context';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Types from 'types';

import {getBEMClassName} from 'utils';

// TODO: tests!

const getCosignStatus = async (baseUrl, submissionUuid) => {
  const endpoint = `${baseUrl}submissions/${submissionUuid}/co-sign`;
  const response = await get(endpoint);
  return response;
};


const CoSignAuthentication = ({ form, submissionUuid, saveStepData, authPlugin }) => {
  const loginOption = form.loginOptions.find(opt => opt.identifier === authPlugin);
  if (!loginOption) {
    return (
      <ErrorMessage>
        <FormattedMessage
          description="Co-sign auth option not available on form"
          defaultMessage="Something went wrong presenting the login option. Please contact the municipality."
        />
      </ErrorMessage>
    );
  }

  // add the co sign submission parameter to the login URL
  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set('coSignSubmission', submissionUuid);
  const modifiedLoginOption = {...loginOption, url: loginUrl.toString()};

  return (
    <Toolbar modifiers={['start']}>
      <ToolbarList>
        <LoginButton option={modifiedLoginOption} onClick={async () => await saveStepData()} />
      </ToolbarList>

      {
        modifiedLoginOption.logo
          ? (
            <ToolbarList>
              <LoginButtonIcon identifier={modifiedLoginOption.identifier} logo={modifiedLoginOption.logo} />
            </ToolbarList>
          )
          : null
      }

    </Toolbar>
  );
};

CoSignAuthentication.propTypes = {
  form: Types.Form.isRequired,
  submissionUuid: PropTypes.string.isRequired,
  authPlugin: PropTypes.string.isRequired,
  saveStepData: PropTypes.func.isRequired,
};


const CoSign = ({
  submissionUuid,
  interactive=true,
  form=null,
  saveStepData,
  authPlugin='digid-mock'
}) => {
  const {baseUrl} = useContext(ConfigContext);
  const {submission} = useContext(SubmissionContext);

  if (!submissionUuid) {
    submissionUuid = submission.id;
  }

  const {loading, value: coSignState, error} = useAsync(
    async () => await getCosignStatus(baseUrl, submissionUuid),
    [baseUrl, submissionUuid]
  );

  // log errors to the console if any
  error && console.error(error);

  // while loading, display spinner
  if (loading) {
    return (<Loader modifiers={['small']} />);
  }
  const {coSigned, representation} = coSignState;

  if (interactive && !coSigned) {

  }

  if (!coSigned) {
    if (!interactive) {
      return (
        <FormattedMessage description="Not co-signed (summary) message" defaultMessage="Not co-signed" />
      );
    }

    if (!form || !saveStepData) {
      throw new Error('Interactive co-sign components require the "form" and "saveStepData" props');
    }

    return (
      <CoSignAuthentication
        form={form}
        submissionUuid={submissionUuid}
        saveStepData={saveStepData}
        authPlugin={authPlugin}
      />
    );
  }

  return (
    <Body component="div">
      <div className={getBEMClassName('co-sign__representation')}>
      {
        representation ?? (<FormattedMessage
          description="Co-signed without representation fallback message"
          defaultMessage="Something went wrong while processing the co-sign authentication. Please contact the municipality."
        />)
      }
      </div>
    </Body>
  );
};

CoSign.propTypes = {
  interactive: PropTypes.bool,
  form: Types.Form,
  submissionUuid: PropTypes.string, // fall back to context if not provided
  saveStepData: PropTypes.func,
  authPlugin: PropTypes.string,
};


export default CoSign;

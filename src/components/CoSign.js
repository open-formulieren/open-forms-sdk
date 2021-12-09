import React from 'react';
import PropTypes from 'prop-types';
import {useAsync} from 'react-use';
import {FormattedMessage} from 'react-intl';

import { get } from 'api';
import Body from 'components/Body';
import ErrorMessage from 'components/ErrorMessage';
import Loader from 'components/Loader';
import LoginButton, {LoginButtonIcon} from 'components/LoginButton';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Types from 'types';

import {getBEMClassName} from 'utils';

// TODO: tests!

const getCosignStatus = async (baseUrl, submissionUuid) => {
  const endpoint = `${baseUrl}submissions/${submissionUuid}/co-sign`;
  const response = await get(endpoint);
  return response;
};

const CoSign = ({ baseUrl, form, submissionUuid, saveStepData, authPlugin='digid-mock' }) => {

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

  const modifiedLoginOption = {
    ...loginOption,
    url: `${loginOption.url}?coSignSubmission=${submissionUuid}`, // TODO: clean up this URL building
  };

  if (coSigned) {
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
  }

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

CoSign.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  form: Types.Form.isRequired,
  submissionUuid: PropTypes.string.isRequired,
  saveStepData: PropTypes.func.isRequired,
  authPlugin: PropTypes.string,
};


export default CoSign;

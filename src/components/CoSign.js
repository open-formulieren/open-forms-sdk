import React from 'react';
import PropTypes from 'prop-types';
import {useAsync} from 'react-use';

import { get } from 'api';
import Body from 'components/Body';
import Loader from 'components/Loader';
import LoginButton, {LoginButtonIcon} from 'components/LoginButton';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Types from 'types';

import {getBEMClassName} from 'utils';

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

  // TODO: nicer component for when co-signed
  // TODO: remove fallback to first option (this is for dev purposes only)
  const loginOption = form.loginOptions.find(opt => opt.identifier === authPlugin) || form.loginOptions[0];
  const modifiedLoginOption = {
    ...loginOption,
    url: `${loginOption.url}?coSignSubmission=${submissionUuid}`, // TODO: clean up this URL building
  };

  if (coSigned) {
    return (
      <Body>
        <div className={getBEMClassName('co-sign__representation')}>{representation}</div>
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

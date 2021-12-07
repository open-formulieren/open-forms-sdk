import React from 'react';
import PropTypes from 'prop-types';
import {useAsync} from 'react-use';

import { get } from 'api';
import Anchor from 'components/Anchor';
import Button from 'components/Button';
import FAIcon from 'components/FAIcon';
import Loader from 'components/Loader';
import LoginButton, {LoginButtonIcon} from 'components/LoginButton';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Types from 'types';

const getCosignStatus = async (baseUrl, submissionUuid) => {
  const endpoint = `${baseUrl}submissions/${submissionUuid}/co-sign`;
  const response = await get(endpoint);
  return response;
};

const CoSign = ({ baseUrl, form, submissionUuid, authPlugin='digid-mock' }) => {

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
  const {coSigned} = coSignState;

  // TODO: nicer component for when co-signed
  // TODO: remove fallback to first option (this is for dev purposes only)
  const loginOption = form.loginOptions.find(opt => opt.identifier === authPlugin) || form.loginOptions[0];
  const modifiedLoginOption = {
    ...loginOption,
    url: `${loginOption.url}?coSignSubmission=${submissionUuid}`, // TODO: clean up this URL building
  };

  if (coSigned) {
    return (<FAIcon icon="check" />);
  }

  return (
    <Toolbar modifiers={['start']}>
      <ToolbarList>
        <LoginButton option={modifiedLoginOption} />
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
  authPlugin: PropTypes.string,
};


export default CoSign;

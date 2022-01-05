import React from 'react';
import PropTypes from 'prop-types';
import {FormattedDate} from 'react-intl';

import {sessionExpiresAt} from 'api';


const DisplaySessionExpiry = () => {
  console.log(sessionExpiresAt);
  return (
    <>
      Session expires at: &nbsp;
      <FormattedDate value={sessionExpiresAt} hour="numeric" minute="numeric" />
    </>
  );
};


/**
 * Debug component to visualize Form Step developer information.
 * @param  {Object} props.data The form step form user-supplied data, current field values.
 * @return {JSX}
 */
const FormStepDebug = ({ data={} }) => {
  return (
    <div style={{background: '#eeeeee', 'marginTop': '1em'}}>
      <p style={{paddingLeft: '1em'}}><small>(this div is development only)</small></p>

      <div style={{padding: '1em'}}>
        <DisplaySessionExpiry />
      </div>

      <div style={{padding: '1em'}}>
        <strong>Form data</strong>
        <code>
          <pre>{JSON.stringify(data, null, 4)}</pre>
        </code>
      </div>
    </div>
  );
};

FormStepDebug.propTypes = {
  data: PropTypes.object,
};


export default FormStepDebug;

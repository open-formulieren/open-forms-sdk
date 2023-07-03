import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import {CheckboxWithoutFormik} from 'components/forms';

import ErrorMessage from './ErrorMessage';
import './PrivacyCheckbox.scss';

const PrivacyCheckbox = ({label, value, warning = false, onChange}) => {
  const labelBody = (
    <Body
      component="div"
      modifiers={['wysiwyg', 'inline']}
      dangerouslySetInnerHTML={{__html: label}}
    />
  );
  return (
    <div className="openforms-privacy-checkbox">
      <CheckboxWithoutFormik
        name="privacy"
        label={labelBody}
        id="privacy"
        isRequired
        value={value}
        onChange={onChange}
      />
      {warning && (
        <ErrorMessage modifiers={['warning']}>
          <FormattedMessage
            description="Warning privacy policy not checked when submitting"
            defaultMessage="Please accept the privacy policy before submitting"
          />
        </ErrorMessage>
      )}
    </div>
  );
};

PrivacyCheckbox.propTypes = {
  /**
   * Label content displayed next to the checkbox, allows HTML.
   *
   * Ensure that this only contains trusted markup, as the content is NOT escaped.
   */
  label: PropTypes.string.isRequired,
  /**
   * Policy accepted state.
   */
  value: PropTypes.bool.isRequired,
  /**
   * Whether to display the warning or not.
   */
  warning: PropTypes.bool,
  /**
   * Callback for when the checkbox is clicked/toggled.
   *
   * The callback receives a checkbox input change event.
   */
  onChange: PropTypes.func.isRequired,
};

export default PrivacyCheckbox;

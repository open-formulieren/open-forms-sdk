import {Checkbox, FormField, FormLabel} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {getBEMClassName} from 'utils';

import ErrorMessage from './ErrorMessage';

const PrivacyCheckbox = ({label, value, warning = false, onChange}) => {
  return (
    <div
      className={`${getBEMClassName(
        'form-choices'
      )} utrecht-form-fieldset__fieldset utrecht-form-fieldset__fieldset--html-fieldset`}
    >
      <FormField className={getBEMClassName('form-choices__choice')}>
        <Checkbox name="privacy" id="privacy" required={true} value={value} onChange={onChange} />
        <div className={getBEMClassName('form-choices__checkmark')} />

        <FormLabel
          type="checkbox"
          className={`${getBEMClassName(
            'form-choices__label'
          )} utrecht-form-label utrecht-form-label--checkbox`}
          htmlFor="privacy"
        >
          <div
            className={getBEMClassName('form-choices__wysiwyg-text')}
            dangerouslySetInnerHTML={{__html: label}}
          />
        </FormLabel>
      </FormField>
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

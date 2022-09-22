import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

import {getBEMClassName} from '../utils';
import {Checkbox, FormField, FormLabel} from '@utrecht/component-library-react';
import ErrorMessage from './ErrorMessage';


const PrivacyCheckbox = ({label, value, warning=false, onChange}) => {
  const inputClassname = classNames(
    getBEMClassName('privacy-checkbox__input', warning ? ['warning'] : [])
  );

  return (
    <FormField className={getBEMClassName('privacy-checkbox')}>
      <div className={inputClassname}>
        <Checkbox
          name="privacy"
          id="privacy"
          required={true}
          value={value}
          onChange={onChange}
        />
        <div className={getBEMClassName('privacy-checkbox__checkmark')} />
        <FormLabel
          type="checkbox"
          className={getBEMClassName('privacy-checkbox__label')}
          htmlFor="privacy"
        >
          <div
            className={getBEMClassName('privacy-checkbox__wyswyg-text')}
            dangerouslySetInnerHTML={{__html: label}}
          />
        </FormLabel>
      </div>
      {
        warning && (
          <ErrorMessage modifiers={['warning']}>
            <FormattedMessage
              description="Warning privacy policy not checked when submitting"
              defaultMessage="Please accept the privacy policy before submitting"
            />
          </ErrorMessage>
        )
      }
    </FormField>
  )
};

PrivacyCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  warning: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default PrivacyCheckbox;

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';

import ErrorMessage from './ErrorMessage';
import './PrivacyCheckbox.scss';
import {FormioComponent} from './formio';

const PrivacyCheckbox = ({label, showWarning = false}) => {
  const labelBody = (
    <Body
      component="div"
      modifiers={['wysiwyg', 'inline']}
      dangerouslySetInnerHTML={{__html: label}}
    />
  );
  const formioDefinition = {
    type: 'checkbox',
    key: 'privacy',
    label: labelBody,
    validate: {
      required: true,
    },
  };
  return (
    <div className="openforms-privacy-checkbox">
      <FormioComponent component={formioDefinition} />
      {showWarning && (
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
   * Whether to display the warning or not.
   */
  showWarning: PropTypes.bool,
};

export default PrivacyCheckbox;

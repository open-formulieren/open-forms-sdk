import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';

import ErrorMessage from './ErrorMessage';
import './PrivacyCheckbox.scss';
import {FormioComponent} from './formio';

const PrivacyCheckbox = ({configuration, showWarning = false}) => {
  if (!configuration.validate.required) return null;

  const labelBody = (
    <Body
      component="div"
      modifiers={['wysiwyg', 'inline']}
      dangerouslySetInnerHTML={{__html: configuration.label}}
    />
  );
  const formioDefinition = {
    ...configuration,
    label: labelBody,
  };
  return (
    <div className="openforms-privacy-checkbox">
      <FormioComponent component={formioDefinition} />
      {showWarning && (
        <ErrorMessage modifiers={['warning']}>
          <FormattedMessage
            description="Warning declaration not checked when submitting"
            defaultMessage="Please check the above declaration before submitting"
          />
        </ErrorMessage>
      )}
    </div>
  );
};

PrivacyCheckbox.propTypes = {
  configuration: PropTypes.shape({
    type: PropTypes.oneOf(['checkbox']).isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    validate: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }).isRequired,
  /**
   * Whether to display the warning or not.
   */
  showWarning: PropTypes.bool,
};

export default PrivacyCheckbox;

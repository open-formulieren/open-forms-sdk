import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import ErrorMessage from 'components/ErrorMessage';
import {FormioComponent} from 'components/formio';

import './DeclarationCheckbox.scss';

const DeclarationCheckbox = ({configuration, showWarning = false}) => {
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
  // TODO: When we rework this component, change the class names
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

DeclarationCheckbox.propTypes = {
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

export default DeclarationCheckbox;

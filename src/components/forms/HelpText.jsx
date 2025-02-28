import {FormFieldDescription} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * @deprecated
 */
const HelpText = ({children, ...props}) => {
  if (!children) return null;
  return (
    <FormFieldDescription
      className={classNames(
        'utrecht-form-field-description--openforms-helptext',
        'utrecht-form-field__description'
      )}
      {...props}
    >
      {children}
    </FormFieldDescription>
  );
};

HelpText.propTypes = {
  children: PropTypes.node,
};

export default HelpText;

import {Fieldset, FieldsetLegend, Paragraph} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

import {LabelContent} from 'components/forms/Label';

import './InputGroup.scss';

/**
 * @deprecated
 */
export const InputGroup = ({
  children,
  label,
  isRequired = true,
  disabled = false,
  invalid = false,
}) => (
  <Fieldset disabled={disabled} invalid={invalid}>
    <FieldsetLegend className="utrecht-form-field__label">
      <LabelContent disabled={disabled} isRequired={isRequired}>
        {label}
      </LabelContent>
    </FieldsetLegend>
    <Paragraph className="openforms-input-group">{children}</Paragraph>
  </Fieldset>
);

InputGroup.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
};

/**
 * @deprecated
 */
export const InputGroupItem = ({children, component: Component = 'span'}) => (
  <Component className="openforms-input-group__item">{children}</Component>
);

InputGroupItem.propTypes = {
  /**
   * Provided children are displayed with flexbox (row), and their spacing is applied
   * with CSS and design tokens.
   */
  children: PropTypes.node,
  /**
   * Specify the wrapper component to render for each individual item.
   *
   * You can pass a string for the HTML node to render (span by default), or a React
   * component type.
   *
   * * It must be able to take the `className` prop, like normal DOM  elements do.
   * * It must be limited to inline content, as their parent is a `<p>` element.
   *
   */
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
};

export default InputGroup;

import clsx from 'clsx';
import {Formio} from 'react-formio';

import {applyPrefix} from 'utils';

const FormioComponent = Formio.Components.components.component;

/**
 * Build class names for 'component' component.
 *
 * @deprecated: these class names are no longer rendered in the templates and the CSS
 *   overrides are removed.
 *
 * @todo: check impact of --$type variants in styles
 * @todo: check impact of --multiple in styles
 * @todo: check if any other components than content use customClass
 * @todo: check how the --required modifier is/was used (asterisk?) & take into account
 *   the string 'true' values!
 * @todo: check impact of --hidden modifier
 */
function getClassName() {
  return clsx(
    applyPrefix('form-control'),
    applyPrefix(`form-control--${this.component.type}`),
    {[applyPrefix(`form-control--${this.key}`)]: this.key},
    {[applyPrefix('form-control--multiple')]: this.component.multiple},
    this.component.customClass,
    {
      [applyPrefix('form-control--required')]:
        this.hasInput && this.component.validate && JSON.parse(this.component.validate.required),
    }, // apparently, the string "true" can be present too
    {[applyPrefix('form-control--label-hidden')]: this.labelIsHidden()},
    {[applyPrefix('form-control--hidden')]: !this.visible},
    'utrecht-form-field'
  );
}

/**
 * Extend the default button field to modify it to our needs.
 */
class Component extends FormioComponent {
  get className() {
    return getClassName.call(this);
  }
}

/**
 * Override prototype of all components
 *
 * Formio components have an inheritance chain where each concrete field extends from
 * the Field component, which in turn extends the Component field. So, our custom
 * Component class above is NOT used in those inheritance chains.
 *
 * This means that we have two options: repeating the className override for every
 * component we use and having a lot of code repetition, or modifying the prototype
 * used in the inheritance chain once to replace the default className getter. The
 * latter option is the more maintainable one and that's exactly what happens below.
 */
Object.defineProperty(FormioComponent.prototype, 'className', {
  get: function () {
    return getClassName.call(this);
  },
});

export default Component;

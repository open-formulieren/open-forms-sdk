import {Formio} from 'react-formio';

import {getBEMClassName} from 'utils';

/**
 * Extend the default Content field to modify it to our needs.
 */
class ContentComponent extends Formio.Components.components.content {
  init() {
    super.init();
    const {customClass = ''} = this.component;
    // upstream template is broken (?) and doesn't actually call this.className
    this.component.className = getBEMClassName(
      'formio-content utrecht-html',
      customClass ? [customClass] : []
    );
  }
}

export default ContentComponent;

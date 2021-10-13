import { Formio } from '@formio/react';


/**
 * Extend the default Content field to modify it to our needs.
 */
class ContentComponent extends Formio.Components.components.content {
  init() {
    super.init();
    this.component.customClass = "formio-component-content"
  }
}


export default ContentComponent;

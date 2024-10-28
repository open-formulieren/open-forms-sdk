import FormioUtils from 'formiojs/utils';

import {PREFIX} from './constants';

/**
 * Prefix a name/string/identifier with the Open Forms specific prefix.
 */
const applyPrefix = name => {
  return `${PREFIX}-${name}`;
};

const escapeHtml = source => {
  var pre = document.createElement('pre');
  var text = document.createTextNode(source);
  pre.appendChild(text);
  return pre.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/&/g, '&amp;');
};

const getAriaDescriptions = element =>
  (element.getAttribute('aria-describedby') || '').split(' ').filter(description => !!description);

const setErrorAttributes = (elements, hasErrors, hasMessages, messageContainerId) => {
  // Update the attributes 'aria-invalid' and 'aria-describedby' using hasErrors
  elements.forEach(element => {
    let ariaDescriptions = getAriaDescriptions(element);

    if (hasErrors && hasMessages && !ariaDescriptions.includes(messageContainerId)) {
      // The input has an error, but the error message isn't yet part of the ariaDescriptions
      ariaDescriptions.push(messageContainerId);
    }

    if (!hasErrors && ariaDescriptions.includes(messageContainerId)) {
      // The input doesn't have an error, but the error message is still a part of the ariaDescriptions
      ariaDescriptions = ariaDescriptions.filter(description => description !== messageContainerId);
    }

    if (ariaDescriptions.length > 0) {
      element.setAttribute('aria-describedby', ariaDescriptions.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }

    if (hasErrors) {
      element.setAttribute('aria-invalid', 'true');
    } else {
      element.removeAttribute('aria-invalid');
    }
  });
};

const linkToSoftRequiredDisplay = (elements, component) => {
  // if soft required validation is not enabled, there's nothing to do
  if (!component.component.openForms?.softRequired) return;

  const isEmpty = component.isEmpty();

  const softRequiredIds = [];
  FormioUtils.eachComponent(component.root.components, component => {
    if (component.type === 'softRequiredErrors') {
      const id = `${component.id}-content`;
      softRequiredIds.push(id);
    }
  });

  // Update the attribute 'aria-describedby' based on whether the component is empty
  elements.forEach(element => {
    let ariaDescriptions = getAriaDescriptions(element);

    softRequiredIds.forEach(id => {
      if (isEmpty && !ariaDescriptions.includes(id)) {
        ariaDescriptions.push(id);
      }
      if (!isEmpty && ariaDescriptions.includes(id)) {
        ariaDescriptions = ariaDescriptions.filter(description => description !== id);
      }
    });

    if (ariaDescriptions.length > 0) {
      element.setAttribute('aria-describedby', ariaDescriptions.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  });
};

export {applyPrefix, escapeHtml, setErrorAttributes, linkToSoftRequiredDisplay};

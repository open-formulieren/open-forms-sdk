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

/**
 * Set or remove description IDs from the element's `aria-describedby` attribute.
 * @param  {HTMLElement} element        The element to update.
 * @param  {string[]} descriptionIds    Element IDs to set or remove.
 * @param  {'present' | 'absent'} state Desired state
 * @return {void}
 */
const updateAriaDescriptions = (element, descriptionIds, state) => {
  let ariaDescriptions = getAriaDescriptions(element);

  switch (state) {
    case 'absent': {
      ariaDescriptions = ariaDescriptions.filter(
        description => !descriptionIds.includes(description)
      );
      break;
    }
    case 'present': {
      const idsToAdd = descriptionIds.filter(
        description => !ariaDescriptions.includes(description)
      );
      ariaDescriptions.push(...idsToAdd);
      break;
    }
    default: {
      throw new Error(`Unknown state: ${state}`);
    }
  }

  if (ariaDescriptions.length > 0) {
    element.setAttribute('aria-describedby', ariaDescriptions.join(' '));
  } else {
    element.removeAttribute('aria-describedby');
  }
};

/**
 * Update the accessible error attributes for the input elements
 * @param  {HTMLElement[]}  elements
 * @param  {Boolean} hasErrors
 * @param  {Boolean} hasMessages
 * @param  {string}  messageContainerId
 * @return {void}
 */
const setErrorAttributes = (elements, hasErrors, hasMessages, messageContainerId) => {
  // Update the attributes 'aria-invalid' and 'aria-describedby' using hasErrors
  elements.forEach(element => {
    const desiredState =
      hasErrors & hasMessages
        ? // The input has an error, but the error message isn't yet part of the ariaDescriptions
          'present'
        : // The input doesn't have an error, but the error message is still a part of the ariaDescriptions
          'absent';

    updateAriaDescriptions(element, [messageContainerId], desiredState);

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
    updateAriaDescriptions(element, softRequiredIds, isEmpty ? 'present' : 'absent');
  });
};

export {applyPrefix, escapeHtml, setErrorAttributes, linkToSoftRequiredDisplay};

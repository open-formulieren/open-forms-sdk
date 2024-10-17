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

const setErrorAttributes = (elements, hasErrors, hasMessages, messageContainerId) => {
  // Update the attributes 'aria-invalid' and 'aria-describedby' using hasErrors
  elements.forEach(element => {
    let ariaDescriptions = (element.getAttribute('aria-describedby') || '')
      .split(' ')
      .filter(description => !!description);

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

export {applyPrefix, escapeHtml, setErrorAttributes};

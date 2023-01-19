import { PREFIX } from './constants';

/**
 * Prefix a name/string/identifier with the Open Forms specific prefix.
 */
const applyPrefix = (name) => {
  return `${PREFIX}-${name}`;
};

const escapeHtml = source => {
  var pre = document.createElement('pre');
  var text = document.createTextNode(source);
  pre.appendChild(text);
  return pre.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/&/g, '&amp;');
};

export { applyPrefix, escapeHtml };

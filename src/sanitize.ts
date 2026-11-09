import DOMPurify from 'dompurify';

/**
 * Dict of HTML elements and their allowed attributes.
 */
const HTML_ATTRIBUTES_ALLOWLIST: {[key: string]: string[]} = {
  a: ['href', 'rel', 'target'],
};

/**
 * Sanitize HTML content using DOMPurify.sanitize.
 *
 * @param htmlContent The HTML content to sanitize.
 * @param forceBody Whether to pass the `FORCE_BODY: true` argument to
 * DOMPurify.sanitize. This forces all elements (including script and style) to be
 * children of document.body.
 *
 * @return Sanitized HTML content.
 */
export const HTMlSanitize = (htmlContent: string, forceBody?: boolean): string => {
  return DOMPurify.sanitize(htmlContent, {
    USE_PROFILES: {html: true},
    ADD_ATTR: (attributeName, tagName) => isAttributeAllowedOnElement(attributeName, tagName),
    ...(forceBody ? {FORCE_BODY: true} : undefined),
  });
};

/**
 * Check if the combination of HTML element and attribute is present in the allowlist.
 *
 * @param attributeName Name of the HTML attribute.
 * @param tagName Name of the HTML element.
 */
export const isAttributeAllowedOnElement = (attributeName: string, tagName: string): boolean => {
  return HTML_ATTRIBUTES_ALLOWLIST[tagName]?.includes(attributeName) || false;
};

import DOMPurify from 'dompurify';

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
  /**
   * Dict of HTML elements and their allowed attributes.
   */
  const allowlist: {[key: string]: string[]} = {
    a: ['target'],
  };

  return DOMPurify.sanitize(htmlContent, {
    USE_PROFILES: {html: true},
    ADD_ATTR: (attributeName, tagName) => {
      // In addition to the profile configuration, we allow specific attributes per HTML
      // element.
      return allowlist[tagName]?.includes(attributeName) || false;
    },
    ...(forceBody ? {FORCE_BODY: true} : undefined),
  });
};

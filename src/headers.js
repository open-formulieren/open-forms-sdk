const CSPNonceHeaderName = 'X-CSP-Nonce';
const CSRFTokenHeaderName = 'X-CSRFToken';
const IsFormDesignerHeaderName = 'X-Is-Form-Designer';


const factoryHeader = (headerName, headerValue) => {
  return {
    headerName: headerName,
    value: headerValue,
    getValue() {
      return headerValue;
    },
    setValue(value) {
      headerValue = value;
    }
  };
};

/**
 * Global module-scoped variable to track the value of the CSP nonce.
 *
 * A CSP nonce is set when the page is initially loaded and is valid for that page
 * and/or request only. Content loaded asynchronously via fetch/ajax that uses inline
 * styles (such as WYSIWYG editor output) must use the same nonce set by the parent
 * page (either as HTTP response header or as meta tag).
 *
 * The Open Forms SDK includes the value of the cspNonce as a header in fetch api calls
 * so that any HTML can be post-processed to add the correct nonce.
 */
let CSPNonce = factoryHeader(CSPNonceHeaderName, null);


/**
 * Global module-scoped variable to track the value of the CSRF Token.
 *
 * Embedders can set the CSRF Token value, which allows admin users to be recognized
 * so they can use demo auth plugins (as one use case example).
 *
 * The Open Forms SDK includes the value of the CSRF Token as a header in fetch api
 * calls if it's set.
 */
let CSRFToken = factoryHeader(CSRFTokenHeaderName, null);


/**
 * Global module-scoped variable to track whether the user is a Form Designer.
 *
 * Form designers are allowed to navigate between submission steps even if these are not completed.
 *
 */
let IsFormDesigner = factoryHeader(IsFormDesignerHeaderName, false);

/**
 * Global module-scoped variable to track the current (UI) language.
 *
 * The backend interprets the HTTP Accept-Language (request) header and informs us of
 * the activated language via the Content-Language response header.
 */
let ContentLanguage = factoryHeader('Content-Language', 'nl');

export {CSPNonce, CSRFToken, IsFormDesigner, ContentLanguage};

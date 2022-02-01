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

let CSPNonce = null;

const setCSPNonce = (value) => CSPNonce = value;

const getCSPNonce = () => CSPNonce;

export {getCSPNonce, setCSPNonce};

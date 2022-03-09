/**
 * Global module-scoped variable to track the value of the CSRF Token.
 *
 * Embedders can set the CSRF Token value, which allows admin users to be recognized
 * so they can use demo auth plugins (as one use case example).
 *
 * The Open Forms SDK includes the value of the CSRF Token as a header in fetch api
 * calls if it's set.
 */

let CSRFToken = null;

const setCSRFToken = (value) => CSRFToken = value;

const getCSRFToken = () => CSRFToken;

export {getCSRFToken, setCSRFToken};

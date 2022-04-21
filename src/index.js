import { OpenForm, setCSRFToken } from './sdk';
import './index.scss';

const {REACT_APP_BASE_API_URL, REACT_APP_FORM_ID} = process.env;

window.onload = () => {
    const formId = (new URLSearchParams(document.location.search)).get('form');
    const targetNode = document.getElementById('root');
    extractAndSetCSRFToken().then(() => {
      const form = new OpenForm(targetNode, {
          baseUrl: REACT_APP_BASE_API_URL,
          formId: formId || REACT_APP_FORM_ID,
          basePath: '/',
      });
      form.init();
    });
};


// development only (with CRA SPA) - grab the admin login page and extract the CSRF token
// from the DOM
const extractAndSetCSRFToken = () => {
  const loginUrl = `${REACT_APP_BASE_API_URL}../../admin/login/`;
  return window.fetch(loginUrl, {credentials: 'include'})
    .then(response => {
      if (response.url.endsWith('/admin/')) {
        // already logged in, grab the token from another page
        const passwordResetUrl = `${REACT_APP_BASE_API_URL}../../admin/password_change/`;
        return window
          .fetch(passwordResetUrl, {credentials: 'include'})
          .then(response => response.text());
      }
      else {
        return response.text();
      }
    })
    .then(html => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(html, 'text/html');
      const hiddenInput = htmlDoc.querySelector('[name="csrfmiddlewaretoken"]');
      hiddenInput && setCSRFToken(hiddenInput.value);
    });
};

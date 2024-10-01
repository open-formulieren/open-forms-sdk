import './index.scss';
import {OpenForm} from './sdk';

// import displayComponents from './custom-display-components';

const {VITE_BASE_API_URL, VITE_FORM_ID, VITE_USE_HASH_ROUTING} = import.meta.env;

window.onload = () => {
  const formId = new URLSearchParams(document.location.search).get('form');
  const targetNode = document.getElementById('root');
  const form = new OpenForm(targetNode, {
    baseUrl: VITE_BASE_API_URL,
    formId: formId || VITE_FORM_ID,
    basePath: '/',
    // added for testing purposes - adding a real CSP breaks *a lot* of things of Create
    // React App :(
    CSPNonce: 'RqgbALvp8D5b3+8NuhfuKg==',
    // displayComponents,
    useHashRouting: VITE_USE_HASH_ROUTING === 'true' || false,
  });
  form.init();
};

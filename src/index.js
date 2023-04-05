import './index.scss';
import {OpenForm} from './sdk';

// import displayComponents from './custom-display-components';

const {REACT_APP_BASE_API_URL, REACT_APP_FORM_ID, REACT_APP_USE_HASH_ROUTING} = process.env;

window.onload = () => {
  const formId = new URLSearchParams(document.location.search).get('form');
  const targetNode = document.getElementById('root');
  const form = new OpenForm(targetNode, {
    baseUrl: REACT_APP_BASE_API_URL,
    formId: formId || REACT_APP_FORM_ID,
    basePath: '/',
    // displayComponents,
    useHashRouting: REACT_APP_USE_HASH_ROUTING === 'true' || false,
  });
  form.init();
};

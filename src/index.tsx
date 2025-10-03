import {getEnv} from '@/env';

import './index.scss';
import {OpenForm} from './sdk';

const BASE_API_URL = getEnv('BASE_API_URL');
const FORM_ID = getEnv('FORM_ID');
const USE_HASH_ROUTING = getEnv('USE_HASH_ROUTING');

window.onload = () => {
  const formId = new URLSearchParams(document.location.search).get('form');
  const targetNode = document.getElementById('root');
  const form = new OpenForm(targetNode!, {
    baseUrl: BASE_API_URL!,
    formId: formId || FORM_ID!,
    basePath: '/',
    // added for testing purposes - adding a real CSP breaks *a lot* of things of Create
    // React App :(
    CSPNonce: 'RqgbALvp8D5b3+8NuhfuKg==',
    backToTopText: 'Back to top',
    useHashRouting: USE_HASH_ROUTING === 'true' || false,
  });
  form.init();
};

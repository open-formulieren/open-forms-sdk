import { OpenForm } from './sdk';
import './index.scss';

const {REACT_APP_BASE_API_URL, REACT_APP_FORM_ID} = process.env;

window.onload = () => {
    const targetNode = document.getElementById('root');
    const form = new OpenForm(targetNode, {
        baseUrl: REACT_APP_BASE_API_URL,
        formId: REACT_APP_FORM_ID,
    });
    form.init();
};

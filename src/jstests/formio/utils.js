import _ from 'lodash';
import {Formio} from 'react-formio';

/**
 * Render the form according to the provided form configuration and extra options.
 * @param  {Object} formConfig    The form configuration.
 * @param  {Object} options       Extra configuration options for the form.
 * @return {Object}               An object containing the form configuration and the container.
 */
export const renderForm = async (formConfig, options = {}) => {
  let formJSON = _.cloneDeep(formConfig);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const form = await Formio.createForm(container, formJSON, options);
  return {form, container};
};

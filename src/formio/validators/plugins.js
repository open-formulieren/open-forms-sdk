import {post} from '../../api';

export const pluginsAPIValidator = {
  key: `validate.backendApi`,
  check(component, setting, value) {
    if (!value) return true;

    const plugins = component.component.validate.plugins;
    const {baseUrl} = component.currentForm?.options || component.options;

    const promises = plugins.map(plugin => {
      const url = `${baseUrl}validation/plugins/${plugin}`;
      return post(url, {value}).then(response => {
        const valid = response.data.isValid;
        return valid ? true : response.data.messages.join('<br>');
      });
    });
    return Promise.all(promises)
      .then(results => {
        const anyValid = results.some(result => result === true);

        if (anyValid) return true;

        return results.join('<br>');
      })
      .catch(() => false);
  },
};

/**
 * Utility function to register the plugins from component configuration with the
 * component
 * @param  {Object} component The Formio.js component instance
 * @return {Void}             Configures the validators on the component instance.
 */
const enableValidationPlugins = component => {
  if (Array.isArray(component.component.validate.plugins)) {
    component.component.validateOn = 'blur';
    component.validator.validators.backendApi = pluginsAPIValidator;
    component.validators.push('backendApi');
  }
};

export default enableValidationPlugins;

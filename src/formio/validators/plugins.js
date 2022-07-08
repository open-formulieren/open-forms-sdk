import {post} from "../../api";

const errorMessageMap = {
  'kvk-kvkNumber': 'Invalid Kvk Number',
  'kvk-rsin': 'Invalid RSIN',
  'kvk-branchNumber': 'Invalid Branch Number',
  'phonenumber-international': 'Invalid international phonenumber',
  'phonenumber-nl': 'Invalid Dutch phonenumber',
};


const pluginAPIValidator = (plugin) => {
  let defaultMsg = errorMessageMap[plugin];
  // catches undefined too
  if (defaultMsg == null) {
    defaultMsg = "Invalid";
  }

  return {
    key: `validate.${plugin}`,
    message(component) {
      return component.t(component.errorMessage(defaultMsg), {
        field: component.errorLabel,
        data: component.data
      });
    },
    check(component, setting, value) {
      if (!value) return true;

      const {baseUrl} = component.currentForm?.options || component.options;
      const url = `${baseUrl}validation/plugins/${plugin}`;
      return (
        post(url, {value})
          .then(response => {
            const valid = response.data.isValid;
            return valid ? true : response.data.messages.join('<br>');
          })
          .catch(() => false)
      );
    }
  };
};


/**
 * Utility function to register the plugins from component configuration with the
 * component
 * @param  {Object} component The Formio.js component instance
 * @return {Void}             Configures the validators on the component instance.
 */
const enableValidationPlugins = (component) => {
  if (Array.isArray(component.component.validate.plugins)) {

    for (let plugin of component.component.validate.plugins) {
      const validator = pluginAPIValidator(plugin);
      if (validator == null) continue;
      component.component.validateOn = 'blur';
      component.validator.validators[plugin] = validator;
      component.validators.push(plugin);
    }
  }
};


export default enableValidationPlugins;

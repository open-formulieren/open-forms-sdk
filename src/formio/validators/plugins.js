import {post} from "../../api";

const {REACT_APP_BASE_API_URL} = process.env;


const VALIDATE_ENDPOINT = `${REACT_APP_BASE_API_URL}validation/plugins/`;

const errorMessageMap = {
  'kvk-kvkNumber': 'Invalid Kvk Number',
  'kvk-rsin': 'Invalid RSIN',
  'kvk-branchNumber': 'Invalid Branch Number',
};


const pluginAPIValidator = (plugin) => {
  const defaultMsg = errorMessageMap[plugin];
  // catches undefined too
  if (defaultMsg == null) return null;

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

      const url = `${VALIDATE_ENDPOINT}${plugin}`;
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


export default pluginAPIValidator;

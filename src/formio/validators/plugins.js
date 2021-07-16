import {post} from "../../api";

const {REACT_APP_BASE_API_URL} = process.env;


const KvkNumberValidator = {
  key: "validate.kvk-kvkNumber",
  message(component) {
    return component.t(component.errorMessage('Invalid Kvk Number'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }

    return post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-kvkNumber`, {value})
      .then(response => response.data.isValid)
      .catch(() => false);
  }
};


const KvkRsinValidator = {
  key: "validate.kvk-rsin",
  message(component) {
    return component.t(component.errorMessage('Invalid RSIN'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    return post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-rsin`, {value})
      .then(response => response.data.isValid)
      .catch(() => false);
  }
};


const KvkBranchNumberValidator = {
  key: "validate.kvk-branchNumber",
  message(component) {
    return component.t(component.errorMessage('Invalid Branch Number'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    return post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-branchNumber`, {value})
      .then(response => response.data.isValid)
      .catch(() => false);
  }
};


const PluginValidatorMapping =  {
  'kvk-kvkNumber': KvkNumberValidator,
  'kvk-rsin': KvkRsinValidator,
  'kvk-branchNumber': KvkBranchNumberValidator
};


export default PluginValidatorMapping;

import {post} from "../../api";

const {REACT_APP_BASE_API_URL} = process.env;

const KvkNumberValidator = {
  key: "validate.kvkNumber",
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
    post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-kvkNumber`, {value: value})
      .then(response => {
        console.log('response.data.isValid: ' + response.data.isValid);
        return response.data.isValid;
      })
      .catch(error => console.log(error));
  }
};


const RsinValidator = {
  key: "validate.rsin",
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
    post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-rsin`, {value: value})
      .then(response => {
        console.log('response.data.isValid: ' + response.data.isValid);
        return response.data.isValid;
      })
      .catch(error => console.log(error));
  }
};


const BranchNumberValidator = {
  key: "validate.branchNumber",
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
    post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-branchNumber`, {value: value})
      .then(response => {
        console.log('response.data.isValid: ' + response.data.isValid);
        return response.data.isValid;
      })
      .catch(error => console.log(error));
  }
};

export { KvkNumberValidator, RsinValidator, BranchNumberValidator };

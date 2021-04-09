import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Form as FormioForm, Errors as FormioErrors } from 'react-formio';
import useAsync from 'react-use/esm/useAsync';

import FormStepsSidebar from './FormStepsSidebar';
import { get } from './api';


/**
 * An OpenForms form.
 *
 * OpenForms forms consist of some metadata and individual steps.
 * @param  {Object} options.form The form definition from the Open Forms API
 * @return {JSX}
 */
 const Form = ({ form, titleComponent='h2' }) => {
  const { name, steps } = form;
  const Title = `${titleComponent}`;

  const [currentStep, setCurrentStep] = useState(steps[0]);

  const {loading, value, error} = useAsync(
    async () => await get(currentStep.url)
  );

  return (
    <div className="card">
      <header className="card__header">
        <Title className="title">{name}</Title>
      </header>
      <div className="card__body" style={{display: 'flex'}}>

        <div style={{width: '75%'}}>
          {
            value ? (
              <FormioForm form={value.configuration} onSubmit={console.log} />
            ) : null
          }
        </div>
        <FormStepsSidebar steps={steps} />

      </div>
    </div>
    );
};

Form.propTypes = {
  titleComponent: PropTypes.string,
  form: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    loginRequired: PropTypes.bool.isRequired,
    product: PropTypes.object,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      formDefinition: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export { Form };

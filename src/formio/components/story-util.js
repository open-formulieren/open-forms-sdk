import merge from 'lodash/merge';
import {useContext} from 'react';
import {Form} from 'react-formio';
import {useIntl} from 'react-intl';

import {ConfigContext, FormioTranslations} from 'Context';
import {PREFIX} from 'formio/constants';

const RenderFormioForm = ({configuration, submissionData = {}, evalContext = {}}) => {
  const config = useContext(ConfigContext);
  const formioTranslations = useContext(FormioTranslations);
  const intl = useIntl();
  // Similar to FormStep/index.js usage
  return (
    <Form
      form={configuration}
      submission={{data: submissionData}}
      options={{
        noAlerts: true,
        baseUrl: config.baseUrl,
        language: intl.locale,
        i18n: formioTranslations.i18n, // TODO - get this from backend/bake into build?
        evalContext: {
          ofPrefix: `${PREFIX}-`,
          requiredFieldsWithAsterisk: config.requiredFieldsWithAsterisk,
          ...evalContext,
        },
        // custom options
        intl,
      }}
    />
  );
};

export const SingleFormioComponent = ({
  type,
  key,
  formioKey = null,
  label,
  extraComponentProperties = {},
  submissionData = {},
  evalContext = {},
}) => {
  // in case this is used as a react component, allow using an alias, because React
  // reserves the key 'prop'
  key = formioKey ?? key;
  const component = merge({type, key, label}, extraComponentProperties);
  return (
    <RenderFormioForm
      configuration={{type: 'form', components: [component]}}
      submissionData={submissionData}
      evalContext={evalContext}
    />
  );
};

export const MultipleFormioComponents = ({components, evalContext = {}}) => (
  <RenderFormioForm
    configuration={{type: 'form', components: components}}
    evalContext={evalContext}
  />
);

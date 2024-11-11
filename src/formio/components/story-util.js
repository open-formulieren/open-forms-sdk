import merge from 'lodash/merge';
import {useContext} from 'react';
import {Form} from 'react-formio';
import {useIntl} from 'react-intl';

import {ConfigContext, FormioTranslations} from 'Context';
import {PREFIX} from 'formio/constants';

const RenderFormioForm = ({
  configuration,
  submissionData = {},
  evalContext = {},
  ofContext = {},
  onSubmit = () => {},
}) => {
  const config = useContext(ConfigContext);
  const formioTranslations = useContext(FormioTranslations);
  const intl = useIntl();
  // Similar to FormStep/index.js usage
  return (
    <Form
      form={configuration}
      submission={{data: submissionData}}
      onSubmit={onSubmit}
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
        ofContext: {
          submissionUuid: '426c8d33-6dcb-4578-8208-f17071a4aebe',
          ...ofContext,
        },
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
  ofContext = {},
  onSubmit = () => {},
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
      ofContext={ofContext}
      onSubmit={onSubmit}
    />
  );
};

export const MultipleFormioComponents = ({
  components,
  evalContext = {},
  ofContext = {},
  onSubmit = () => {},
}) => (
  <RenderFormioForm
    configuration={{type: 'form', components: components}}
    evalContext={evalContext}
    ofContext={ofContext}
    onSubmit={onSubmit}
  />
);

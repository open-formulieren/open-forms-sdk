import {Form} from 'react-formio';

import {PREFIX} from 'formio/constants';

export const FormioForm = ({form}) => <Form form={form} />;

export const FormioComponent = ({component, components = [], evalContext = {}, data = {}}) => (
  <Form
    form={{
      type: 'form',
      components: components.length ? components : [component],
    }}
    submission={{data: data}}
    options={{
      noAlerts: true,
      language: 'nl', // TODO - get this from the i18n addon
      // i18n: formioTranslations.i18n, // TODO - get this from backend/bake into build?
      evalContext: {
        ofPrefix: `${PREFIX}-`,
        requiredFieldsWithAsterisk: true, // TODO: create addon to configure this?
        ...evalContext,
      },
    }}
  />
);

export const FormDecorator = Story => (
  <div className="utrecht-document" style={{'--utrecht-space-around': 1}}>
    {Story()}
  </div>
);

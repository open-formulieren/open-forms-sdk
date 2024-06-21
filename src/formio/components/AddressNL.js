/**
 * The addressNL component.
 */
import {Formik, useFormikContext} from 'formik';
import debounce from 'lodash/debounce';
import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {FormattedMessage, IntlProvider, defineMessages, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {TextField} from 'components/forms';
import enableValidationPlugins from 'formio/validators/plugins';

const Field = Formio.Components.components.field;

export default class AddressNL extends Field {
  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
    // the edit grid renderRow otherwise wraps the result of getValueAsString in a
    // readonly input...
    this.component.template = 'hack';
  }

  static schema(...extend) {
    return Field.schema(
      {
        type: 'addressNL',
        label: 'Address NL',
        input: true,
        key: 'addressNL',
        defaultValue: {},
        validateOn: 'blur',
        openForms: {
          checkIsEmptyBeforePluginValidate: true,
        },
      },
      ...extend
    );
  }

  static get builderInfo() {
    return {
      title: 'Address NL',
      icon: 'home',
      weight: 500,
      schema: AddressNL.schema(),
    };
  }

  checkComponentValidity(data, dirty, row, options = {}) {
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }

  get defaultSchema() {
    return AddressNL.schema();
  }

  get emptyValue() {
    return {
      postcode: '',
      houseNumber: '',
      houseLetter: '',
      houseNumberAddition: '',
    };
  }

  validateMultiple() {
    return false;
  }

  render() {
    return super.render(
      `<div ref="element">
        ${this.renderTemplate('addressNL')}
      </div>`
    );
  }

  /**
   * Defer to React to actually render things.
   */
  attach(element) {
    this.loadRefs(element, {
      addressNLContainer: 'single',
    });
    return super.attach(element).then(() => {
      this.reactRoot = createRoot(this.refs.addressNLContainer);
      this.renderReact();
    });
  }

  destroy() {
    const container = this.refs.addressNLContainer;
    container && this.reactRoot.unmount();
    super.destroy();
  }

  onFormikChange(value, isValid) {
    this.updateValue(value, {modified: true});

    // we can shortcuts-skip validation if the Formik form isn't valid.
    if (!isValid) return;

    // `enableValidationPlugins` forces the component to be validateOn = 'blur', which
    // surpresses the validators due to onChange events.
    // Since this is a composite event, we need to fire the blur event ourselves and
    // schedule the validation to run.
    // Code inspired on Formio.js' `src/components/_classes/input/Input.js`, in
    // particular the `addFocusBlurEvents` method.
    //
    if (this.component.validateOn === 'blur') {
      if (this._debouncedBlur) {
        this._debouncedBlur.cancel();
      }

      this._debouncedBlur = debounce(() => {
        this.root.triggerChange(
          {fromBlur: true},
          {
            instance: this,
            component: this.component,
            value: this.dataValue,
            flags: {fromBlur: true},
          }
        );
      }, 50);

      this._debouncedBlur();
    }
  }

  renderReact() {
    const required = this.component?.validate?.required || false;
    const initialValues = {...this.emptyValue, ...this.dataValue};

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider
          value={{
            baseUrl: this.options.baseUrl,
            requiredFieldsWithAsterisk: this.options.evalContext.requiredFieldsWithAsterisk,
          }}
        >
          <AddressNLForm
            initialValues={initialValues}
            required={required}
            setFormioValues={this.onFormikChange.bind(this)}
          />
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }

  setValue(value, flags = {}) {
    const changed = super.setValue(value, flags);
    // re-render if the value is set, which may be because of existing submission data
    changed && this.renderReact();
    return changed;
  }

  // Called in the representation of an edit grid
  getValueAsString(value, options) {
    if (!value || !Object.keys(value).length) return '';
    const {postcode, houseNumber, houseLetter, houseNumberAddition, streetName, city} = value;
    return `
        <address>
          ${postcode} ${houseNumber}${houseLetter} ${houseNumberAddition}
          <br>
          ${streetName} ${city}
        </address>
    `;
  }
}

const FIELD_LABELS = defineMessages({
  postcode: {
    description: 'Label for addressNL postcode input',
    defaultMessage: 'Postcode',
  },
  houseNumber: {
    description: 'Label for addressNL houseNumber input',
    defaultMessage: 'House number',
  },
});

const addressNLSchema = (required, intl) => {
  let postcodeSchema = z.string().regex(/^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$/);
  let houseNumberSchema = z.string().regex(/^\d{1,5}$/);
  if (!required) {
    postcodeSchema = postcodeSchema.optional();
    houseNumberSchema = houseNumberSchema.optional();
  }

  return z
    .object({
      postcode: postcodeSchema,
      houseNumber: houseNumberSchema,
      houseLetter: z
        .string()
        .regex(/^[a-zA-Z]$/)
        .optional(),
      houseNumberAddition: z
        .string()
        .regex(/^([a-zA-Z0-9]){1,4}$/)
        .optional(),
    })
    .superRefine((val, ctx) => {
      if (!required) {
        if (val.postcode && !val.houseNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: intl.formatMessage({
              description:
                'ZOD error message when AddressNL postcode is provided but not houseNumber',
              defaultMessage: 'You must provide a house number.',
            }),
            path: ['houseNumber'],
          });
        }

        if (!val.postcode && val.houseNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: intl.formatMessage({
              description:
                'ZOD error message when AddressNL houseNumber is provided but not postcode',
              defaultMessage: 'You must provide a postcode.',
            }),
            path: ['postcode'],
          });
        }
      }
    });
};

const AddressNLForm = ({initialValues, required, setFormioValues}) => {
  const intl = useIntl();

  const errorMap = (issue, ctx) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type: {
        if (issue.received === z.ZodParsedType.undefined) {
          const fieldName = issue.path.join('.');
          const fieldLabel = intl.formatMessage(FIELD_LABELS[fieldName]);
          const message = intl.formatMessage(
            {
              description: 'Required field error message',
              defaultMessage: '{field} is required.',
            },
            {
              field: fieldLabel,
            }
          );
          return {message};
        }
        break;
      }
      default: {
        break;
      }
    }
    return {message: ctx.defaultError}; // use global schema as fallback
  };

  return (
    <Formik
      initialValues={initialValues}
      initialTouched={{
        postcode: true,
        houseNumber: true,
      }}
      validationSchema={toFormikValidationSchema(addressNLSchema(required, intl), {errorMap})}
    >
      <FormikAddress required={required} setFormioValues={setFormioValues} />
    </Formik>
  );
};

const FormikAddress = ({required, setFormioValues}) => {
  const {values, isValid} = useFormikContext();

  useEffect(() => {
    // *always* synchronize the state up, since:
    //
    // - we allow invalid values of a field to be saved in the backend when suspending
    //   the form
    // - the field values don't change, but validation change states -> this can lead
    //   to missed backend-validation-plugin calls otherwise
    setFormioValues(values, isValid);
  });

  return (
    <div className="openforms-form-field-container">
      <div className="openforms-columns">
        <div className="column column--span-6 openforms-form-field-container">
          <PostCodeField required={required} />
        </div>
        <div className="column column--span-6 openforms-form-field-container">
          <TextField
            name="houseNumber"
            label={<FormattedMessage {...FIELD_LABELS.houseNumber} />}
            placeholder="123"
            isRequired={required}
          />
        </div>
      </div>
      <div className="openforms-columns">
        <div className="column column--span-6 openforms-form-field-container">
          <TextField
            name="houseLetter"
            label={
              <FormattedMessage
                description="Label for addressNL houseLetter input"
                defaultMessage="House letter"
              />
            }
          />
        </div>
        <div className="column column--span-6 openforms-form-field-container">
          <TextField
            name="houseNumberAddition"
            label={
              <FormattedMessage
                description="Label for addressNL houseNumberAddition input"
                defaultMessage="House number addition"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

const PostCodeField = ({required}) => {
  const {getFieldProps, getFieldHelpers} = useFormikContext();
  const {value, onBlur: onBlurFormik} = getFieldProps('postcode');
  const {setValue} = getFieldHelpers('postcode');

  const onBlur = event => {
    onBlurFormik(event);
    // format the postcode with a space in between
    const firstGroup = value.substring(0, 4);
    const secondGroup = value.substring(4);
    if (secondGroup && !secondGroup.startsWith(' ')) {
      setValue(`${firstGroup} ${secondGroup}`);
    }
  };

  return (
    <TextField
      name="postcode"
      label={<FormattedMessage {...FIELD_LABELS.postcode} />}
      placeholder="1234 AB"
      isRequired={required}
      onBlur={onBlur}
    />
  );
};

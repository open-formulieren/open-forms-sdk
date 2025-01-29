/**
 * The addressNL component.
 */
import {Formik, useFormikContext} from 'formik';
import debounce from 'lodash/debounce';
import {createRef, useContext, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {FormattedMessage, IntlProvider, defineMessages, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {TextField} from 'components/forms';
import enableValidationPlugins from 'formio/validators/plugins';

import './AddressNL.scss';

const Field = Formio.Components.components.field;

export default class AddressNL extends Field {
  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
    // the edit grid renderRow otherwise wraps the result of getValueAsString in a
    // readonly input...
    this.component.template = 'hack';
    // needed for manually triggering the formik validate method
    this.formikInnerRef = createRef();
  }

  static schema(...extend) {
    return Field.schema(
      {
        type: 'addressNL',
        label: 'Address NL',
        input: true,
        key: 'addressNL',
        defaultValue: this.emptyValue,
        validateOn: 'blur',
        deriveAddress: false,
        layout: 'doubleColumn',
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

  async checkComponentValidity(data, dirty, row, options = {}) {
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }

    if (!dirty) {
      return super.checkComponentValidity(data, dirty, row, updatedOptions);
    }

    // Trigger again formik validation in order to show the generic error along with the
    // nested fields errors and prevent the form from being submitted.
    // Tried to go deeper for this in formio but this will be properly handled in the new
    // form renderer.
    if (this.formikInnerRef.current) {
      const errors = await this.formikInnerRef.current.validateForm();

      if (Object.keys(errors).length > 0) {
        this.setComponentValidity(
          [
            {
              message: this.t('There are errors concerning the nested fields.'),
              level: 'error',
            },
          ],
          true,
          false
        );
        return false;
      }
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }

  get defaultSchema() {
    return AddressNL.schema();
  }

  static get emptyValue() {
    return {
      postcode: '',
      houseNumber: '',
      houseLetter: '',
      houseNumberAddition: '',
      city: '',
      streetName: '',
      secretStreetCity: '',
      autoPopulated: false,
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
      if (!this.component?.hidden) {
        this.reactRoot = createRoot(this.refs.addressNLContainer);
        this.renderReact();
      }
    });
  }

  destroy() {
    const container = this.refs.addressNLContainer;
    if (!this.component?.hidden && container) this.reactRoot.unmount();
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
    if (this.component?.hidden) {
      return;
    }
    const required = this.component?.validate?.required || false;
    const initialValues = {...AddressNL.emptyValue, ...this.dataValue};

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider
          value={{
            baseUrl: this.options.baseUrl,
            requiredFieldsWithAsterisk: this.options.evalContext.requiredFieldsWithAsterisk,
            component: this.component,
          }}
        >
          <AddressNLForm
            initialValues={initialValues}
            required={required}
            deriveAddress={this.component.deriveAddress}
            layout={this.component.layout}
            setFormioValues={this.onFormikChange.bind(this)}
            formikInnerRef={this.formikInnerRef}
          />
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }

  setValue(value, flags = {}) {
    const changed = super.setValue(value, flags);
    // re-render if the value is set, which may be because of existing submission data
    if (changed) this.renderReact();
    return changed;
  }

  // Called in the representation of an edit grid
  getValueAsString(value) {
    if (!value || !Object.keys(value).length) return '';
    const {postcode, houseNumber, houseLetter, houseNumberAddition, streetName, city} = value;
    return `
        <address>
          ${postcode} ${houseNumber}${houseLetter} ${houseNumberAddition}
          ${streetName && city ? `<br>${streetName} ${city}` : ''}
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
  houseLetter: {
    description: 'Label for addressNL houseLetter input',
    defaultMessage: 'House letter',
  },
  houseNumberAddition: {
    description: 'Label for addressNL houseNumberAddition input',
    defaultMessage: 'House number addition',
  },
  streetName: {
    description: 'Label for addressNL streetName input',
    defaultMessage: 'Street name',
  },
  city: {
    description: 'Label for addressNL city input',
    defaultMessage: 'City',
  },
});

const addressNLSchema = (required, deriveAddress, intl, {postcode = {}, city = {}}) => {
  // Optionally use a user-supplied pattern/regex for more fine grained pattern
  // validation, and if a custom error message was supplied, use it.
  const postcodeRegex = postcode?.pattern
    ? new RegExp(postcode.pattern)
    : /^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$/;
  const postcodeErrorMessage =
    postcode?.errorMessage ??
    intl.formatMessage({
      description:
        'ZOD error message when AddressNL postcode does not match the postcode regular expression',
      defaultMessage: 'Postcode must be four digits followed by two letters (e.g. 1234 AB).',
    });
  let postcodeSchema = z.string().regex(postcodeRegex, {message: postcodeErrorMessage});

  let streetNameSchema = z.string();
  const {pattern: cityPattern = '', errorMessage: cityErrorMessage = ''} = city;
  let citySchema = z.string();
  if (cityPattern) {
    citySchema = citySchema.regex(
      new RegExp(cityPattern),
      cityErrorMessage ? {message: cityErrorMessage} : undefined
    );
  }

  let houseNumberSchema = z.string().regex(/^\d{1,5}$/, {
    message: intl.formatMessage({
      description:
        'ZOD error message when AddressNL house number does not match the house number regular expression',
      defaultMessage: 'House number must be a number with up to five digits (e.g. 456).',
    }),
  });

  if (!required) {
    postcodeSchema = postcodeSchema.optional();
    houseNumberSchema = houseNumberSchema.optional();
    streetNameSchema = streetNameSchema.optional();
    citySchema = citySchema.optional();
  } else if (!deriveAddress) {
    streetNameSchema = streetNameSchema.optional();
    citySchema = citySchema.optional();
  }

  return z
    .object({
      postcode: postcodeSchema,
      streetName: streetNameSchema,
      city: citySchema,
      houseNumber: houseNumberSchema,
      houseLetter: z
        .string()
        .regex(/^[a-zA-Z]$/, {
          message: intl.formatMessage({
            description:
              'ZOD error message when AddressNL house letter does not match the house letter regular expression',
            defaultMessage: 'House letter must be a single letter.',
          }),
        })
        .optional(),
      houseNumberAddition: z
        .string()
        .regex(/^([a-zA-Z0-9]){1,4}$/, {
          message: intl.formatMessage({
            description:
              'ZOD error message when AddressNL house number addition does not match the house number addition regular expression',
            defaultMessage: 'House number addition must be up to four letters and digits.',
          }),
        })
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

const AddressNLForm = ({
  initialValues,
  required,
  deriveAddress,
  layout,
  setFormioValues,
  formikInnerRef,
}) => {
  const intl = useIntl();

  const {
    component: {
      openForms: {components: nestedComponents},
    },
  } = useContext(ConfigContext);
  const {postcode, city} = nestedComponents || {};

  const postcodePattern = postcode?.validate?.pattern;
  const postcodeError = postcode?.translatedErrors[intl.locale].pattern;
  const cityPattern = city?.validate?.pattern;
  const cityError = city?.translatedErrors[intl.locale].pattern;

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
      innerRef={formikInnerRef}
      initialValues={initialValues}
      initialTouched={{
        postcode: true,
        houseNumber: true,
        city: true,
        streetName: true,
      }}
      validationSchema={toFormikValidationSchema(
        addressNLSchema(required, deriveAddress, intl, {
          postcode: {
            pattern: postcodePattern,
            errorMessage: postcodeError,
          },
          city: {
            pattern: cityPattern,
            errorMessage: cityError,
          },
        }),
        {errorMap}
      )}
    >
      <FormikAddress
        required={required}
        setFormioValues={setFormioValues}
        deriveAddress={deriveAddress}
        layout={layout}
      />
    </Formik>
  );
};

const FormikAddress = ({required, setFormioValues, deriveAddress, layout}) => {
  const {values, isValid, setFieldValue} = useFormikContext();
  const {baseUrl} = useContext(ConfigContext);
  const [isAddressAutoFilled, setAddressAutoFilled] = useState(true);
  const useColumns = layout === 'doubleColumn';

  useEffect(() => {
    // *always* synchronize the state up, since:
    //
    // - we allow invalid values of a field to be saved in the backend when suspending
    //   the form
    // - the field values don't change, but validation change states -> this can lead
    //   to missed backend-validation-plugin calls otherwise
    setFormioValues(values, isValid);
  });

  const autofillAddress = async () => {
    if (!deriveAddress) return;
    if (!values.postcode || !values.houseNumber) return;

    const params = {
      postcode: values['postcode'],
      house_number: values['houseNumber'],
    };

    const data = await get(`${baseUrl}geo/address-autocomplete`, params);

    setFieldValue('city', data['city']);
    setFieldValue('streetName', data['streetName']);
    setFieldValue('secretStreetCity', data['secretStreetCity']);

    // mark the auto-filled fields as populated and disabled when they have been both
    // retrieved from the API and they do have a value
    const dataRetrieved = !!(data['city'] && data['streetName']);
    setAddressAutoFilled(dataRetrieved);
    setFieldValue('autoPopulated', dataRetrieved);
  };

  return (
    <div
      className={
        useColumns
          ? 'openforms-addressnl openforms-addressnl--double-column'
          : 'openforms-addressnl openforms-addressnl--single-column'
      }
    >
      <PostCodeField required={required} autoFillAddress={autofillAddress} />
      <HouseNumberField required={required} autoFillAddress={autofillAddress} />
      <TextField name="houseLetter" label={<FormattedMessage {...FIELD_LABELS.houseLetter} />} />
      <TextField
        name="houseNumberAddition"
        label={<FormattedMessage {...FIELD_LABELS.houseNumberAddition} />}
      />
      {deriveAddress && (
        <>
          <TextField
            name="streetName"
            label={<FormattedMessage {...FIELD_LABELS.streetName} />}
            disabled={isAddressAutoFilled}
            isRequired={required}
          />
          <TextField
            name="city"
            label={<FormattedMessage {...FIELD_LABELS.city} />}
            disabled={isAddressAutoFilled}
            isRequired={required}
          />
        </>
      )}
    </div>
  );
};

const PostCodeField = ({required, autoFillAddress}) => {
  const {values, setFieldValue, getFieldProps} = useFormikContext();
  const {onBlur: onBlurFormik} = getFieldProps('postcode');
  const postcode = values['postcode'];

  const onBlur = event => {
    onBlurFormik(event);
    // format the postcode with a space in between
    const firstGroup = postcode.substring(0, 4);
    const secondGroup = postcode.substring(4);
    if (secondGroup && !secondGroup.startsWith(' ')) {
      setFieldValue('postcode', `${firstGroup} ${secondGroup}`);
    }

    autoFillAddress();
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

const HouseNumberField = ({required, autoFillAddress}) => {
  const {getFieldProps} = useFormikContext();
  const {onBlur: onBlurFormik} = getFieldProps('houseNumber');

  const onBlur = event => {
    onBlurFormik(event);
    autoFillAddress();
  };

  return (
    <TextField
      name="houseNumber"
      label={<FormattedMessage {...FIELD_LABELS.houseNumber} />}
      placeholder="123"
      isRequired={required}
      onBlur={onBlur}
    />
  );
};

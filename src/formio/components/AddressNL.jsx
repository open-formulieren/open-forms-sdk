/**
 * The addressNL component.
 */
import {TextField} from '@open-formulieren/formio-renderer';
import {Formik, useFormikContext} from 'formik';
import debounce from 'lodash/debounce';
import {useContext, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {FormattedMessage, IntlProvider, defineMessages, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {autoCompleteAddress} from 'data/geo';
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
  }

  static schema(...extend) {
    return Field.schema(
      {
        type: 'addressNL',
        label: 'Address NL',
        input: true,
        key: 'addressNL',
        defaultValue: {
          postcode: '',
          houseNumber: '',
          houseLetter: '',
          houseNumberAddition: '',
          city: '',
          streetName: '',
          secretStreetCity: '',
        },
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
      city: '',
      streetName: '',
      secretStreetCity: '',
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
    if (!this.component?.hidden && container && this.reactRoot) this.reactRoot.unmount();
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
    const initialValues = {...this.emptyValue, ...this.dataValue};

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
});

const addressNLSchema = (required, intl, {postcode = {}, city = {}}) => {
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
  }

  return z
    .object({
      postcode: postcodeSchema,
      city: citySchema.optional(),
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

const AddressNLForm = ({initialValues, required, deriveAddress, layout, setFormioValues}) => {
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
      initialValues={initialValues}
      initialTouched={{
        postcode: true,
        houseNumber: true,
        city: true,
      }}
      validationSchema={toFormikValidationSchema(
        addressNLSchema(required, intl, {
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

    const data = await autoCompleteAddress(baseUrl, values.postcode, values.houseNumber);

    setFieldValue('city', data['city']);
    setFieldValue('streetName', data['streetName']);
    setFieldValue('secretStreetCity', data['secretStreetCity']);
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
      <TextField
        name="houseLetter"
        label={
          <FormattedMessage
            description="Label for addressNL houseLetter input"
            defaultMessage="House letter"
          />
        }
      />
      <TextField
        name="houseNumberAddition"
        label={
          <FormattedMessage
            description="Label for addressNL houseNumberAddition input"
            defaultMessage="House number addition"
          />
        }
      />
      {deriveAddress && (
        <>
          <TextField
            name="streetName"
            label={
              <FormattedMessage
                description="Label for addressNL streetName read only result"
                defaultMessage="Street name"
              />
            }
            isReadOnly
          />
          <TextField
            name="city"
            label={
              <FormattedMessage
                description="Label for addressNL city read only result"
                defaultMessage="City"
              />
            }
            isReadOnly
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

import {maskInput} from '@formio/vanilla-text-mask';
import FormioUtils from 'formiojs/utils';
import _, {set} from 'lodash';
import {Formio} from 'react-formio';

/**
 * Extend the default text field to modify it to our needs.
 */
class Currency extends Formio.Components.components.currency {
  formatValue(value) {
    if (this.component.requireDecimal && value && !value.includes(this.decimalSeparator)) {
      return `${value}${this.decimalSeparator}${_.repeat('0', this.decimalLimit)}`;
    } else if (this.component.requireDecimal && value && value.includes(this.decimalSeparator)) {
      return `${value}${_.repeat(
        '0',
        this.decimalLimit - value.split(this.decimalSeparator)[1].length
      )}`;
    }

    return value;
  }

  addZerosAndFormatValue(value) {
    if (!value && value !== 0) return;

    const decimalLimit = _.get(this.component, 'decimalLimit', 2);

    let integerPart;
    let decimalPart = '';
    let decimalPartNumbers = [];
    const negativeValueSymbol = '-';
    const hasPrefix = this.currencyPrefix ? value.includes(this.currencyPrefix) : false;
    const hasSuffix = this.currencySuffix ? value.includes(this.currencySuffix) : false;
    const isNegative = value.includes(negativeValueSymbol) || false;

    value = super.stripPrefixSuffix(isNegative ? value.replace(negativeValueSymbol, '') : value);

    if (value.includes(this.decimalSeparator)) {
      [integerPart, decimalPart] = value.split(this.decimalSeparator);
      decimalPartNumbers = [...decimalPart.split('')];
    } else {
      integerPart = value;
    }

    if (decimalPart.length < decimalLimit) {
      while (decimalPartNumbers.length < decimalLimit) {
        decimalPartNumbers.push('0');
      }
    }

    // The functions addZerosAndFormatValue and formatValue are adapted from the Formio Currency component and
    // the Number component respectively to fix the problem that if a currency has no decimals allowed, the decimal
    // separator is still shown. See Github https://github.com/open-formulieren/open-forms/issues/1270
    // The part below is different from the original function
    const formattedIntegerPart = `${isNegative ? negativeValueSymbol : ''}${
      hasPrefix ? this.currencyPrefix : ''
    }${integerPart}`;
    const formattedDecimalPart = `${this.decimalSeparator}${decimalPartNumbers.join('')}`;
    let formattedValue;

    if (decimalLimit > 0) {
      formattedValue = formattedIntegerPart + formattedDecimalPart;
    } else {
      formattedValue = formattedIntegerPart;
    }
    formattedValue += hasSuffix ? this.currencySuffix : '';

    return this.formatValue(formattedValue);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--openforms',
    ].join(' ');
    return info;
  }

  // Issue OF#1351
  // Taken from Formio https://github.com/formio/formio.js/blob/v4.13.13/src/components/currency/Currency.js#L65
  // Modified for the case where negative currencies are allowed.
  // In addZerosAndFormatValue, we format the negative currency as -€ 127,54 so the validator checks against this format
  setInputMask(input) {
    let numberPattern = '';
    if (this.component.allowNegative) {
      numberPattern += '-*';
    }
    const affixes = FormioUtils.getCurrencyAffixes({
      currency: this.component.currency,
      decimalSeparator: this.decimalSeparator,
      lang: this.options.language,
    });
    numberPattern += `${affixes.prefix}[0-9`;
    numberPattern += this.decimalSeparator || '';
    numberPattern += this.delimiter || '';
    numberPattern += ']*';

    input.setAttribute('pattern', numberPattern);
    input.mask = maskInput({
      inputElement: input,
      mask: this.numberMask || '',
      shadowRoot: this.root ? this.root.shadowRoot : null,
    });
  }

  // Overwrite Formio method because of issue OF#2903
  set dataValue(value) {
    if (
      !this.allowData ||
      !this.key ||
      (!this.visible && this.component.clearOnHide && !this.rootPristine)
    ) {
      return;
    }
    // Issue 2903 - make it possible to set the value to null. Otherwise, the user cannot clear the
    // value of a number/currency field if it has already been saved.
    if (value === undefined) {
      this.unset();
      return;
    }

    value = this.hook('setDataValue', value, this.key, this._data);
    set(this._data, this.key, value);
  }

  // Inheritance of getter/setter: since we have overwritten the setter, we must define a
  // getter or the property 'dataValue' will always return undefined
  get dataValue() {
    return super.dataValue;
  }
}

export default Currency;

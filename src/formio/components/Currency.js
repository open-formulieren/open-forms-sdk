import { Formio } from 'react-formio';
import _ from 'lodash';

import { applyPrefix } from '../utils';

/**
 * Extend the default text field to modify it to our needs.
 */
class Currency extends Formio.Components.components.currency {

  formatValue(value) {
    if (this.component.requireDecimal && value && !value.includes(this.decimalSeparator)) {
      return `${value}${this.decimalSeparator}${_.repeat('0', this.decimalLimit)}`;
    }
    else if (this.component.requireDecimal && value && value.includes(this.decimalSeparator)) {
      return `${value}${_.repeat('0', this.decimalLimit - value.split(this.decimalSeparator)[1].length)}`;
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

    value = super.stripPrefixSuffix(isNegative ? value.replace(negativeValueSymbol,'') : value);

    if (value.includes(this.decimalSeparator)) {
      [integerPart, decimalPart] = value.split(this.decimalSeparator);
      decimalPartNumbers =[...decimalPart.split('')] ;
    }
    else {
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
    const formattedIntegerPart = `${isNegative ? negativeValueSymbol:''}${hasPrefix ? this.currencyPrefix : ''}${integerPart}`;
    const formattedDecimalPart = `${this.decimalSeparator}${decimalPartNumbers.join('')}`;
    let formattedValue;

    if (decimalLimit > 0) {
      formattedValue = formattedIntegerPart + formattedDecimalPart;
    } else {
      formattedValue = formattedIntegerPart;
    }
    formattedValue += (hasSuffix ? this.currencySuffix : '');

    return this.formatValue(formattedValue);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('input'),
      'utrecht-textbox',
      'utrecht-textbox--html-input',
    ].join(' ');
    return info;
  }
}


export default Currency;

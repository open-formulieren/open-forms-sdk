import {FormField, Textbox} from '@utrecht/component-library-react';

import FAIcon from 'components/FAIcon';

export default {
  title: 'Form.io components / Helpers / Input group',
};

export const Suffix = {
  render: () => (
    <FormField>
      <div className="openforms-input-container">
        <Textbox />
        <span className="openforms-input-container__affix openforms-input-container__affix--suffix">
          cm<sup>2</sup>
        </span>
      </div>
    </FormField>
  ),
};

export const Prefix = {
  render: () => (
    <FormField>
      <div className="openforms-input-container">
        <span className="openforms-input-container__affix openforms-input-container__affix--prefix">
          <FAIcon icon="user" />
        </span>
        <Textbox />
      </div>
    </FormField>
  ),
};

export const Both = {
  render: () => (
    <FormField>
      <div className="openforms-input-container">
        <span className="openforms-input-container__affix openforms-input-container__affix--prefix">
          <FAIcon icon="scale-balanced" />
        </span>
        <Textbox />
        <span className="openforms-input-container__affix openforms-input-container__affix--suffix">
          kg
        </span>
      </div>
    </FormField>
  ),
};

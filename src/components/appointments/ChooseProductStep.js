import {Button, Heading2, Paragraph} from '@utrecht/component-library-react';
import {FieldArray, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {getBEMClassName} from '../../utils';
import {Toolbar, ToolbarList} from '../Toolbar';
import AppointmentProduct from './AppointmentProduct';

const ChooseProductStep = ({namePrefix}) => {
  const {values} = useFormikContext();
  const intl = useIntl();
  const handleRemove = (remove, index) => {
    if (values.appointmentProducts.length === 1) {
      // Do not remove the last AppointmentProduct component
      return;
    }
    remove(index);
  };

  return (
    <div className={getBEMClassName('choose-product-step')}>
      <FieldArray name="appointmentProducts">
        {({push, remove}) => (
          <>
            {values.appointmentProducts.map((_, index) => (
              <div key={index}>
                <Paragraph>
                  <Heading2>
                    <FormattedMessage
                      description="Product unit step title"
                      defaultMessage={`Subject `}
                    />{' '}
                    {index + 1}/{values.appointmentProducts.length}
                  </Heading2>
                </Paragraph>
                <AppointmentProduct
                  namePrefix={`${namePrefix}.appointmentProducts[${index}]`}
                  selectLabel={intl.formatMessage({
                    description: 'Product unit step select label',
                    defaultMessage: 'Product',
                  })}
                  numberLabel={intl.formatMessage({
                    description: 'Product unit step number label',
                    defaultMessage: 'Amount',
                  })}
                />
                <Toolbar modifiers={['bottom', 'reverse']}>
                  <ToolbarList>
                    <Button
                      className={getBEMClassName('button', ['primary-action', 'danger'])}
                      disabled={values.appointmentProducts.length === 1}
                      variant="danger"
                      onClick={() => handleRemove(remove, index)}
                    >
                      <FormattedMessage
                        description="Product unit step remove button"
                        defaultMessage="Remove"
                      />
                    </Button>
                  </ToolbarList>
                </Toolbar>
              </div>
            ))}
            <Button
              className={getBEMClassName('button', ['primary-action', 'primary'])}
              variant="primary"
              onClick={() => push({})}
            >
              <FormattedMessage description="Product unit step add button" defaultMessage="Add" />
            </Button>
          </>
        )}
      </FieldArray>
    </div>
  );
};

ChooseProductStep.propTypes = {
  namePrefix: PropTypes.string.isRequired,
};

export default ChooseProductStep;

import {DateField} from '@open-formulieren/formio-renderer';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import {Form, Formik} from 'formik';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

export default {
  title: 'Pure React Components / Forms / DateField / Input group',
  component: DateField,
  decorators: [FormikDecorator],
  args: {
    widget: 'inputGroup',
    description: '',
    isDisabled: false,
  },
  argTypes: {
    minDate: {table: {disable: true}},
    maxDate: {table: {disable: true}},
    isDisabledDates: {table: {disable: true}},
  },
  parameters: {
    formik: {
      initialValues: {
        test: '2023-06-16',
      },
    },
  },
};

export const InputGroup = {
  name: 'Input group',
  args: {
    name: 'test',
    label: 'A memorable date',
    description: "What's your favourite date?",
    isRequired: false,
  },
};

export const ISO8601 = {
  name: 'Value normalizes to ISO-8601',
  render: ({onSubmit}) => (
    <Formik
      initialValues={{test: ''}}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <DateField name="test" label="Test normalization" widget="inputGroup" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  ),
  parameters: {
    formik: {disable: true},
  },
  args: {
    onSubmit: fn(),
  },
  argTypes: {
    widget: {table: {disable: true}},
    description: {table: {disable: true}},
    isDisabled: {table: {disable: true}},
    name: {table: {disable: true}},
    label: {table: {disable: true}},
    isRequired: {table: {disable: true}},
  },
  play: async ({canvasElement, args, step}) => {
    const canvas = within(canvasElement);
    await step('Fill out inputs', async () => {
      await userEvent.type(canvas.getByLabelText('Dag'), '9');
      await userEvent.type(canvas.getByLabelText('Maand'), '6');
      await userEvent.type(canvas.getByLabelText('Jaar'), '2023');
    });

    await step('Submit form and inspect data', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({test: '2023-06-09'}));
    });
  },
};

export const NoAsterisks = {
  name: 'No asterisk for required',
  decorators: [ConfigDecorator],
  parameters: {
    config: {
      requiredFieldsWithAsterisk: false,
    },
  },
  args: {
    name: 'test',
    label: 'Default required',
    isRequired: true,
  },
};

export const WithValidationError = {
  name: 'With validation error',
  args: {
    name: 'test',
    label: 'When was the battle of Hastings?',
    isRequired: true,
  },
  parameters: {
    formik: {
      initialValues: {test: '1066-10-34'},
      initialErrors: {test: 'Invalid date entered'},
      initialTouched: {test: true},
    },
  },
};

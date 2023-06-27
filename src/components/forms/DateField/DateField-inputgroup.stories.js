import {expect, jest} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';
import {Form, Formik} from 'formik';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import DateField from './DateField';

export default {
  title: 'Pure React Components / Forms / DateField / Input group',
  component: DateField,
  decorators: [FormikDecorator],
  args: {
    widget: 'inputGroup',
    showFormattedDate: false,
    description: '',
    id: '',
    disabled: false,
  },
  argTypes: {
    minDate: {table: {disable: true}},
    maxDate: {table: {disable: true}},
    disabledDates: {table: {disable: true}},
    showFormattedDate: {control: 'boolean'},
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
        console.log(onSubmit, values);
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <DateField name="test" label="Test normalization" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  ),
  parameters: {
    formik: {disable: true},
  },
  argTypes: {
    onSubmit: {action: true},
    widget: {table: {disable: true}},
    showFormattedDate: {table: {disable: true}},
    description: {table: {disable: true}},
    id: {table: {disable: true}},
    disabled: {table: {disable: true}},
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
    },
  },
};

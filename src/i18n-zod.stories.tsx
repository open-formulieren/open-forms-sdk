import {PrimaryActionButton, TextField} from '@open-formulieren/formio-renderer';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {ButtonGroup} from '@utrecht/button-group-react';
import {Form, Formik} from 'formik';
import {useIntl} from 'react-intl';
import {fn, userEvent, within} from 'storybook/test';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import useZodErrorMap from '@/hooks/useZodErrorMap';

interface Args {
  email: string;
  number: number;
}

export default {
  title: 'Private API / ZOD translations',
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

interface TestComponentProps {
  email: string;
  number: number;
}

const TestComponent: React.FC<TestComponentProps> = ({email, number}) => {
  useZodErrorMap();
  const result = z
    .object({
      email: z.string().email(),
      number: z.number().min(10),
    })
    .safeParse({email, number});

  if (result.success) {
    return <div>Data validates</div>;
  }

  const formatted = result.error.format();
  return (
    <>
      <p>Error messages should be in Dutch</p>

      <div>
        <strong>email errors</strong>
        <ul>
          {(formatted.email?._errors || []).map(err => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>number errors</strong>
        <ul>
          {(formatted.number?._errors || []).map(err => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const NLTranslations: Story = {
  name: 'Dutch error messages',
  parameters: {
    locale: 'nl',
  },
  render: ({email, number}) => <TestComponent email={email} number={number} />,
  args: {
    email: undefined,
    number: 5,
  },
};

interface AccessibleErrorsExampleProps {
  onSubmit: () => void;
}

const AccessibleErrorsExample: React.FC<AccessibleErrorsExampleProps> = ({onSubmit}) => {
  const intl = useIntl();
  useZodErrorMap();
  const labels: Record<string, string> = {
    name: 'Name',
    email: 'Email address',
  };
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const errorMap: z.ZodErrorMap = (issue, ctx) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type: {
        if (issue.received === z.ZodParsedType.undefined) {
          const fieldName = issue.path.join('.');
          const message = intl.formatMessage(
            {
              description: 'Required field error message',
              defaultMessage: '{field} is a required field.',
            },
            {field: labels[fieldName]}
          );
          return {message};
        }
      }
    }
    return {message: ctx.defaultError}; // use global schema as fallback
  };

  return (
    <Formik
      initialValues={{name: '', email: ''}}
      onSubmit={onSubmit}
      validationSchema={toFormikValidationSchema(schema, {errorMap})}
    >
      <Form>
        <div className="openforms-form-field-container">
          <TextField name="name" label={labels.name} />
          <TextField type="email" name="email" label={labels.email} />
          <ButtonGroup>
            <PrimaryActionButton type="submit">Submit</PrimaryActionButton>
          </ButtonGroup>
        </div>
      </Form>
    </Formik>
  );
};

export const LocalOverridePOC: StoryObj<unknown> = {
  name: 'Accessible errors example',
  render: () => <AccessibleErrorsExample onSubmit={fn()} />,
  parameters: {locale: 'nl'},
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', {name: 'Submit'});

    await step('Submitting without input displays errors', async () => {
      await userEvent.click(submitButton);
      await canvas.findByText('Het verplichte veld Name is niet ingevuld.');
      await canvas.findByText('Het verplichte veld Email address is niet ingevuld.');
    });

    await step('Other validation errors fall back to global error map', async () => {
      const email = canvas.getByLabelText('Email address');
      await userEvent.type(email, 'invalid email');
      await canvas.findByText('Ongeldig e-mailadres.');
    });
  },
};

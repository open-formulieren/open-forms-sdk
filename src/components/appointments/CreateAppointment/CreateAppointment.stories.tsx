import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, waitFor, within} from '@storybook/test';
import {addDays, format} from 'date-fns';
import {enGB, nl} from 'date-fns/locale';
import {RouterProvider, createMemoryRouter} from 'react-router';

import {FormContext} from '@/Context';
import {buildForm} from '@/api-mocks';
import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentPost,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '@/api-mocks/appointments';
import {mockSubmissionPost, mockSubmissionProcessingStatusGet} from '@/api-mocks/submissions';
import type {Form} from '@/data/forms';
import routes, {FUTURE_FLAGS} from '@/routes';
import {withPageWrapper} from '@/sb-decorators';

import CreateAppointment from './';

const Wrapper: React.FC<{form: Form}> = ({form}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/afspraak-maken/'],
    future: FUTURE_FLAGS,
  });
  return (
    <FormContext.Provider value={form}>
      <RouterProvider router={router} />
    </FormContext.Provider>
  );
};

interface Args {
  name: string;
  supportsMultipleProducts: boolean;
  showProgressIndicator: boolean;
}

export default {
  title: 'Private API / Appointments / CreateForm',
  component: CreateAppointment,
  decorators: [withPageWrapper],
  parameters: {
    msw: {
      handlers: [
        mockSubmissionPost(),
        mockAppointmentProductsGet,
        mockAppointmentLocationsGet,
        mockAppointmentDatesGet,
        mockAppointmentTimesGet,
        mockAppointmentCustomerFieldsGet,
        mockAppointmentPost,
        mockSubmissionProcessingStatusGet,
      ],
    },
  },
  args: {
    name: 'Plan an appointment',
    supportsMultipleProducts: true,
    showProgressIndicator: true,
  },
  render: ({showProgressIndicator, supportsMultipleProducts, name}) => {
    const form = buildForm({
      showProgressIndicator,
      name,
      appointmentOptions: {
        isAppointment: true,
        supportsMultipleProducts,
      },
    });
    return <Wrapper form={form} />;
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const HappyFlow: Story = {
  name: 'Happy flow',
  parameters: {
    // we can't control the browser timezone on chromatic, leading to broken assertions
    // due to the localized appointment times.
    chromatic: {disableSnapshot: true},
  },
  play: async ({canvasElement, step, globals}) => {
    const {locale} = globals;
    const canvas = within(canvasElement);

    const calendarLocale = locale === 'nl' ? nl : enGB;

    await step('Wait for products to load', async () => {
      await waitFor(async () =>
        expect(canvas.queryByRole('button', {name: 'Bevestig producten'})).not.toHaveAttribute(
          'aria-disabled',
          'true'
        )
      );
    });

    await step('Select the product', async () => {
      let productDropdown: HTMLDivElement;
      await waitFor(async () => {
        productDropdown = await canvas.findByRole('combobox');
        expect(productDropdown).toBeVisible();
      });
      productDropdown!.focus();
      await userEvent.keyboard('[ArrowDown]');
      const productOption = await canvas.findByText('Paspoort aanvraag');
      await userEvent.click(productOption);
    });

    await step('Submit the product step', async () => {
      const button = canvas.getByRole('button', {name: 'Bevestig producten'});
      await waitFor(() => expect(button).not.toHaveAttribute('aria-disabled', 'true'));
      await userEvent.click(button);
    });

    await step('Fill out the location and time', async () => {
      expect(await canvas.findByText('Datum en tijd')).toBeVisible();

      // previous step summary section (products)
      expect(await canvas.findByText('Jouw product(en)')).toBeVisible();
      expect(await canvas.findByText('Paspoort aanvraag: 1x')).toBeVisible();

      await waitFor(async () => {
        expect(canvas.getByRole('link', {name: 'Terug naar producten'})).toBeVisible();
        expect(canvas.queryByRole('button', {name: 'Naar contactgegevens'})).not.toHaveAttribute(
          'aria-disabled',
          'true'
        );
        // location auto-filled
        await canvas.findByText('Open Gem (Amsterdam)');
      });

      // this location has a date available tomorrow (see api-mocks/appointments)
      const tomorrow = format(addDays(new Date(), 1), 'P', {
        locale: calendarLocale,
      });
      await canvas.findByText('Datum');
      await waitFor(async () => {
        const dateInput = await canvas.findByLabelText('Datum');
        expect(dateInput).not.toBeDisabled();
        expect(dateInput).not.toHaveAttribute('readonly');
        // FIXME: type in non-iso format
        await userEvent.type(dateInput, tomorrow);
      });

      let timeDropdown: HTMLDivElement;
      await waitFor(async () => {
        timeDropdown = await canvas.findByLabelText('Tijdstip');
        expect(timeDropdown).not.toBeDisabled();
        expect(timeDropdown).not.toHaveAttribute('aria-readonly');
      });
      timeDropdown!.focus();
      await userEvent.keyboard('[ArrowDown]');

      // because of the time change (winter-summer) the regex was simplified,
      // otherwise the localized time cannot be found and selected
      const timeOptions = await canvas.findAllByText(/[0-2][0-9]:00$/);
      await userEvent.click(timeOptions[0]);
    });

    await step('Submit the location and time step', async () => {
      const button = canvas.getByRole('button', {name: 'Naar contactgegevens'});
      await waitFor(() => expect(button).not.toHaveAttribute('aria-disabled', 'true'));
      await userEvent.click(button);
    });

    await step('Fill out the contact details', async () => {
      const tomorrow = format(addDays(new Date(), 1), 'd-M-yyyy', {locale: calendarLocale});

      await waitFor(async () => {
        expect(await canvas.findAllByText('Contactgegevens')).toHaveLength(2);
      });

      // previous steps summary section (products, location and time of the appointment)
      expect(await canvas.findByText('Jouw product(en)')).toBeVisible();
      expect(await canvas.findByText('Paspoort aanvraag: 1x')).toBeVisible();
      expect(await canvas.findByText('Jouw afspraak')).toBeVisible();
      expect(await canvas.findByText(`Open Gem, Amsterdam, ${tomorrow}, 07:00`)).toBeVisible();

      await waitFor(async () => {
        expect(canvas.getByRole('link', {name: 'Terug naar locatie en tijdstip'})).toBeVisible();
      });
      await waitFor(async () => {
        expect(canvas.queryByRole('button', {name: 'Naar overzicht'})).not.toHaveAttribute(
          'aria-disabled',
          'true'
        );
      });
      await userEvent.type(await canvas.findByLabelText('Last name'), 'Elvis');
      await userEvent.type(canvas.getByLabelText('Dag'), '8');
      await userEvent.type(canvas.getByLabelText('Maand'), '1');
      await userEvent.type(canvas.getByLabelText('Jaar'), '1935');
      await userEvent.type(canvas.getByLabelText('Email'), 'theking@elvis.com');
      await userEvent.type(canvas.getByLabelText('Telephone'), '123456789');
      await userEvent.type(canvas.getByLabelText('BSN'), '123456782');
      await userEvent.click(canvas.getByLabelText('Male'));
      // reset focus and blur to trigger validation which doesn't seem to happen
      // automatically here...
      await userEvent.click(canvas.getByText('Last name'));
      await userEvent.click(document.body); // reset focus
    });

    await step('Submit the contact details step', async () => {
      const button = canvas.getByRole('button', {name: 'Naar overzicht'});
      await waitFor(() => expect(button).not.toHaveAttribute('aria-disabled', 'true'));
      await userEvent.click(button);
    });

    await step('Wait for the statements to load', async () => {
      expect(
        await canvas.findByLabelText(
          /I accept the privacy policy and consent to the processing of my personal data/
        )
      );
    });

    await step('Verify and confirm the summary data', async () => {
      await canvas.findByText('Paspoort aanvraag');
      await canvas.findByText('Open Gem');
      await userEvent.click(
        canvas.getByLabelText(
          /I accept the privacy policy and consent to the processing of my personal data/
        )
      );

      // test that the progress indicator displays all the expected links
      await canvas.findByRole('link', {name: 'Product'});
      await canvas.findByRole('link', {name: 'Afspraakdetails'});
      await canvas.findByRole('link', {name: 'Contactgegevens'});
      await canvas.findByRole('link', {name: 'Overzicht'});

      const submitButton = canvas.getByRole('button', {name: 'Confirm'});
      await waitFor(async () => {
        expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
      });
      await userEvent.click(submitButton);
    });

    await step('Confirmation page', async () => {
      await waitFor(
        () => {
          expect(canvas.getByText(/OF-L337/)).toBeVisible();
        },
        {timeout: 2000, interval: 200}
      );
      await canvas.findByRole('link', {name: 'Bevestiging'});
    });
  },
};

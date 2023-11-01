import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';
import {addDays, format} from 'date-fns';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {FormContext} from 'Context';
import {buildForm} from 'api-mocks';
import {mockSubmissionPost} from 'api-mocks/submissions';
import {mockSubmissionProcessingStatusGet} from 'api-mocks/submissions';
import {loadCalendarLocale} from 'components/forms/DateField/DatePickerCalendar';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentPost,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '../mocks';
import CreateAppointment, {routes as childRoutes} from './';

export default {
  title: 'Private API / Appointments / CreateForm',
  component: CreateAppointment,
  decorators: [ConfigDecorator, LayoutDecorator],
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
    supportsMultipleProducts: true,
  },
  argTypes: {
    form: {table: {disable: true}},
  },
};

const Wrapper = ({form}) => {
  const routes = [
    {
      path: '/appointments/*',
      element: <CreateAppointment />,
      children: childRoutes,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/appointments/'],
    initialIndex: 0,
  });
  return (
    <FormContext.Provider value={form}>
      <RouterProvider router={router} />
    </FormContext.Provider>
  );
};

const render = ({showProgressIndicator, supportsMultipleProducts, name}) => {
  const form = buildForm({
    showProgressIndicator,
    name,
    'appointmentOptions.isAppointment': true,
    'appointmentOptions.supportsMultipleProducts': supportsMultipleProducts,
  });
  return <Wrapper form={form} />;
};

export const Default = {
  render,
  args: {
    showProgressIndicator: true,
    name: 'Plan an appointment',
  },
};

export const HappyFlow = {
  name: 'Happy flow',
  render,
  args: {
    showProgressIndicator: true,
    name: 'Plan an appointment',
  },
  parameters: {
    // we can't control the browser timezone on chromatic, leading to broken assertions
    // due to the localized appointment times.
    chromatic: {disableSnapshot: true},
  },
  play: async ({canvasElement, step, globals}) => {
    const {locale} = globals;
    const canvas = within(canvasElement);

    const calendarLocale = loadCalendarLocale(locale);

    await step('Wait for products to load', async () => {
      await waitFor(
        async () =>
          await expect(
            await canvas.queryByRole('button', {name: 'Bevestig producten'})
          ).not.toHaveAttribute('aria-disabled', 'true')
      );
    });

    await step('Select the product', async () => {
      let productDropdown;
      await waitFor(async () => {
        productDropdown = await canvas.findByRole('combobox');
        expect(productDropdown).toBeVisible();
      });
      await productDropdown.focus();
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
      expect(await canvas.findByText('Locatie en tijd')).toBeVisible();
      await waitFor(async () => {
        await expect(canvas.getByRole('link', {name: 'Terug naar producten'})).toBeVisible();
        await expect(
          await canvas.queryByRole('button', {name: 'Naar contactgegevens'})
        ).not.toHaveAttribute('aria-disabled', 'true');
        // location auto-filled
        await canvas.findByText('Open Gem');
      });

      // this location has a date available tomorrow (see ./mocks.js)
      const tomorrow = format(addDays(new Date(), 1), 'P', {
        locale: calendarLocale,
      });
      await canvas.findByText('Datum');
      await waitFor(async () => {
        const dateInput = await canvas.findByLabelText('Datum');
        await expect(dateInput).not.toBeDisabled();
        // FIXME: type in non-iso format
        await userEvent.type(dateInput, tomorrow);
      });

      let timeDropdown;
      await waitFor(async () => {
        timeDropdown = await canvas.findByLabelText('Tijdstip');
        await expect(timeDropdown).not.toBeDisabled();
      });
      await timeDropdown.focus();
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
      expect(await canvas.findByText('Uw gegevens')).toBeVisible();
      await waitFor(async () => {
        await expect(
          canvas.getByRole('link', {name: 'Terug naar locatie en tijdstip'})
        ).toBeVisible();
      });
      await waitFor(async () => {
        await expect(
          await canvas.queryByRole('button', {name: 'Naar overzicht'})
        ).not.toHaveAttribute('aria-disabled', 'true');
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
      await expect(
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
    });
  },
};

import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';
import {addDays, formatISO} from 'date-fns';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {buildForm} from 'api-mocks';
import {mockSubmissionPost} from 'api-mocks/submissions';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
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
      element: <CreateAppointment form={form} />,
      children: childRoutes,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/appointments/'],
    initialIndex: 0,
  });
  return <RouterProvider router={router} />;
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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Wait for products to load', async () => {
      await waitFor(
        async () =>
          await expect(
            await canvas.queryByRole('button', {name: 'Bevestig producten'})
          ).toHaveAttribute('aria-disabled', 'true')
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
      await userEvent.click(canvas.getByRole('button', {name: 'Bevestig producten'}));
    });

    await step('Fill out the location and time', async () => {
      expect(await canvas.findByText('Locatie en tijd')).toBeVisible();
      await waitFor(async () => {
        await expect(canvas.getByRole('button', {name: 'Terug naar producten'})).toBeVisible();
        await expect(
          await canvas.queryByRole('button', {name: 'Naar contactgegevens'})
        ).toHaveAttribute('aria-disabled', 'true');
        // location auto-filled
        await canvas.findByText('Open Gem');
      });

      // this location has a date available tomorrow (see ./mocks.js)
      const tomorrow = formatISO(addDays(new Date(), 1), {representation: 'date'});
      await canvas.findByText('Datum');
      await waitFor(async () => {
        const dateInput = await canvas.findByLabelText('Datum');
        await expect(dateInput).not.toBeDisabled();
        await userEvent.type(dateInput, tomorrow);
      });

      let timeDropdown;
      await waitFor(async () => {
        timeDropdown = await canvas.findByLabelText('Tijdstip');
        await expect(timeDropdown).not.toBeDisabled();
      });
      await timeDropdown.focus();
      await userEvent.keyboard('[ArrowDown]');
      const timeOption = await canvas.findByText(/[0-2]{2}:00$/);
      await userEvent.click(timeOption);
    });

    await step('Submit the location and time step', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Naar contactgegevens'}));
    });
  },
};

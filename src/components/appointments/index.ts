/**
 * This module acts as the (lazy loaded) entry point for the appointments chunk.
 */
import CreateAppointment from './CreateAppointment';
import Confirmation from './CreateAppointment/Confirmation';
import Summary from './CreateAppointment/Summary';
import {CancelAppointment, CancelAppointmentSuccess} from './cancel';
import {ChooseProductStep, ContactDetailsStep, LocationAndTimeStep} from './steps';

export {
  CreateAppointment,
  Confirmation,
  Summary,
  CancelAppointment,
  CancelAppointmentSuccess,
  ChooseProductStep,
  ContactDetailsStep,
  LocationAndTimeStep,
};

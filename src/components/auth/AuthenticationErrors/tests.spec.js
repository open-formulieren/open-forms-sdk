import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import {AuthenticationErrors} from '.';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('Renders DigiD default error', () => {
  act(() => {
    render(<AuthenticationErrors parameters={{'_digid-message': 'error'}} />, container);
  });

  expect(container.textContent).toBe('Er is een fout opgetreden in de communicatie met DigiD. Probeert u het later nogmaals. Indien deze fout blijft aanhouden, kijk dan op de website https://www.digid.nl voor de laatste informatie.');
});


it('Renders DigiD cancel login error', () => {
  act(() => {
    render(<AuthenticationErrors parameters={{'_digid-message': 'login-cancelled'}}/>, container);
  });

  expect(container.textContent).toBe('Je hebt het inloggen met DigiD geannuleerd.');
});


it('Renders EHerkenning default error', () => {
  act(() => {
    render(<AuthenticationErrors parameters={{'_eherkenning-message': 'error'}} />, container);
  });

  expect(container.textContent).toBe('Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.');
});


it('Renders EHerkenning cancel login error', () => {
  act(() => {
    render(<AuthenticationErrors parameters={{'_eherkenning-message': 'login-cancelled'}}/>, container);
  });

  expect(container.textContent).toBe('Je hebt het inloggen met EHerkenning geannuleerd.');
});

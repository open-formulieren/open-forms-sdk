import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {DigidAuthenticationErrors} from "../../../DigidAuthenticationErrors";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Renders DigiD default error", () => {
  act(() => {
    render(<DigidAuthenticationErrors digidMessage="error"/>, container);
  });

  expect(container.textContent).toBe('Er is een fout opgetreden bij het inloggen met DigiD. Probeer het later opnieuw.');
});


it("Renders DigiD cancel login error", () => {
  act(() => {
    render(<DigidAuthenticationErrors digidMessage="login-cancelled"/>, container);
  });

  expect(container.textContent).toBe('Je hebt het inloggen met DigiD geannuleerd.');
});

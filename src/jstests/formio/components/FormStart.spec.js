import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import FormStart from "../../../FormStart";
import {testForm} from "./fixtures/form";
import useQuery from "../../../hooks/useQuery";

jest.mock("../../../hooks/useQuery");

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

it("Form start page displays DigiD generic error", () => {
  const testLocation = new URLSearchParams("?_start=1&_digid-message=error");
  useQuery.mockReturnValue(testLocation);

  act(() => {
    render(
      <FormStart
        form={testForm}
        onFormStart={() => {}}
      />,
      container
    );
  });

  expect(container.textContent).toContain('Er is een fout opgetreden bij het inloggen met DigiD. Probeer het later opnieuw.');
});

it("Form start page displays DigiD cancel login error", () => {
  const testLocation = new URLSearchParams("?_start=1&_digid-message=login-cancelled");
  useQuery.mockReturnValue(testLocation);

  act(() => {
    render(
      <FormStart
        form={testForm}
        onFormStart={() => {}}
      />,
      container
    );
  });

  expect(container.textContent).toContain('Je hebt het inloggen met DigiD geannuleerd.');
});

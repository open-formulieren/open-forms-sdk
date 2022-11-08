import { act, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { OpenForm } from "./sdk.js";

describe("OpenForm", () => {
  it("should accept a selector string as languageSelectorTarget", async (done) => {
    const formRoot = document.createElement("div");
    const target = document.createElement("div");
    target.id = "my_toolbar";
    const form = new OpenForm(formRoot, {
      baseUrl: "http://localhost:8000/api/v2/",
      formId: "81a22589-abce-4147-a2a3-62e9a56685aa",
      languageSelectorTarget: target,
      lang: "nl",
    });

    await act(form.init.bind(form));

    window.setTimeout(() => {expect(target).not.toBeEmptyDOMElement(); done();}, 3000);
  });
});

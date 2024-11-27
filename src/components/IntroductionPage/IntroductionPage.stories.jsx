import {expect, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from 'api-mocks';
import {withForm} from 'story-utils/decorators';

import IntroductionPage from './index';

const DEFAULT_CONTENT = `
  <h2>Voorwaarden</h2>

  <p>U moet aan een aantal voorwaarden voldoen om dit formulier in te kunnen vullen.<br>Hiermee maakt u de kans groter dat uw aanvraag succesvol en snel wordt behandeld.</p>

  <p><a href="https://exampl.ecom" target="_blank" rel="noopener">Bekijk alle voorwaarden</a></p>

  <h2>Dit heeft u nodig</h2>

  <ul>
  <li>Plattegrond van de ruimtes en buitengebieden</li>
  <li>Uittreksel handelsregister Kamer van Koophandel</li>
  <li>Huur- of eigendomsdocumenten voor het gebouw</li>
  <li>Kopie geldig legitimatiebewijs van alle leidinggevenden</li>
  <li>Als u personeel heeft: arbeidsovereenkomst(en)</li>
  <li>Ondernemingsplan</li>
  <li>Een ingevuld Bibob-formulier</li>
  </ul>

  <p><a href="https://example.com" target="_blank" rel="noopener">Bekijk de details van wat u nodig heeft</a></p>

  <h2>Handig om te weten</h2>

  <ul>
  <li>Het duurt ongeveer 15 minuten om dit formulier te vullen.</li>
  <li>Vul alle velden in. Als een veld niet verplicht is, dan staat het erbij.</li>
  <li>U kunt het formulier tussentijds opslaan en later verder gaan.</li>
  <li>Na het versturen ontvangt u een bevestigingsmail. Ook heeft u de mogelijkheid uw aanvraag te downloaden of printen.</li>
  </ul>
`;

export default {
  title: 'Views / IntroductionPage',
  component: IntroductionPage,
  decorators: [withForm, withRouter],
  args: {
    form: buildForm({introductionPageContent: DEFAULT_CONTENT}),
  },
};

export const Default = {
  name: 'IntroductionPage',
};

export const IntroductionPageWithInitialDataReference = {
  name: 'IntroductionPage with initial data reference',
  args: {
    extraParams: {initial_data_reference: '1234'},
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const continueLink = canvas.getByRole('link', {name: 'Doorgaan'});
    await expect(continueLink).toHaveAttribute('href', '/startpagina?initial_data_reference=1234');
  },
};

import {expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import FormHelpContent from './FormHelpContent';

// gh-6890 regression test
test('only the anchor element can have "target", "rel" and "href" attributes', async () => {
  const screen = await render(
    <FormHelpContent
      content={`
          <div>
            <a href="#" target="_blank" rel="noopener">link element</a>
            <p href="#" target="_blank" rel="noopener">p element</p>
          </div>
        `}
    />
  );

  const linkElement = screen.getByRole('link');
  await expect.element(linkElement).toHaveAttribute('target', '_blank');
  await expect.element(linkElement).toHaveAttribute('href', '#');
  await expect.element(linkElement).toHaveAttribute('rel', 'noopener');

  const paragraphElement = screen.getByRole('paragraph');
  await expect.element(paragraphElement).not.toHaveAttribute('target');
  await expect.element(paragraphElement).not.toHaveAttribute('href');
  await expect.element(paragraphElement).not.toHaveAttribute('rel');
});

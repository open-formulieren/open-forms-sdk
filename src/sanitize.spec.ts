import {describe, expect, test} from 'vitest';

import {HTMlSanitize} from '@/sanitize';

describe('HTMlSanitize', () => {
  // gh-6890
  test('Only anchor elements may contain "target" attributes', () => {
    const dirtyContent = `
      <div>
        <a href="#" target="_blank" rel="noopener">link element</a>
        <form target="_blank" aria-label="form element">
          <input type="text" name="foo">
        </form>
        <p target="_blank">p element (doesn't support target attribute)</p>
      </div>
    `;
    const cleanContent = HTMlSanitize(dirtyContent);

    const expectedCleanContent = `
      <div>
        <a href="#" target="_blank" rel="noopener">link element</a>
        <form aria-label="form element">
          <input type="text" name="foo">
        </form>
        <p>p element (doesn't support target attribute)</p>
      </div>
    `;
    expect(cleanContent).toBe(expectedCleanContent);
  });
});

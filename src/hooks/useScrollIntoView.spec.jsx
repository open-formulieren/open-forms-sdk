import {render, screen} from '@testing-library/react';

import useScrollIntoView from './useScrollIntoView';

const TestComponent = () => {
  const ref = useScrollIntoView();
  return <div ref={ref}>Scroll me!</div>;
};

test('useScrollIntoView in jest-dom', () => {
  expect(window.HTMLElement.prototype.scrollIntoView).toBeUndefined();

  render(<TestComponent />);

  expect(screen.getByText('Scroll me!')).toBeVisible();
});

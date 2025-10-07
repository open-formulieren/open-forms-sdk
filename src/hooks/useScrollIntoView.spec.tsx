import {render, screen} from '@testing-library/react';

import useScrollIntoView from './useScrollIntoView';

const TestComponent: React.FC = () => {
  const ref = useScrollIntoView<HTMLDivElement>();
  return <div ref={ref}>Scroll me!</div>;
};

test('useScrollIntoView in jest-dom', () => {
  expect(window.HTMLElement.prototype.scrollIntoView).toBeUndefined();

  render(<TestComponent />);

  expect(screen.getByText('Scroll me!')).toBeVisible();
});

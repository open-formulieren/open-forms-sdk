import {expect} from '@storybook/test';
import {userEvent, waitFor, within} from '@storybook/test';

import {sleep} from 'utils';

import {FloatingWidget, useFloatingWidget} from './FloatingWidget';

const waitForPosition = () => act(async () => {});

export default {
  title: 'Private API / FloatingWidget',
  component: FloatingWidget,
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
};

const waitForFocus = async element => {
  await waitFor(() => expect(element).toHaveFocus());
};

const FloatingWidgetExample = () => {
  const {
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    getReferenceProps,
    isOpen,
    setIsOpen,
    arrowRef,
  } = useFloatingWidget();
  return (
    <>
      <div>
        <label htmlFor="reference">Reference</label>
        <input
          name="reference"
          type="text"
          id="reference"
          defaultValue=""
          ref={refs.setReference}
          data-testid="reference"
          {...getReferenceProps()}
        />
        <FloatingWidget
          isOpen={isOpen}
          context={context}
          setFloating={refs.setFloating}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          arrowRef={arrowRef}
          data-testid="floating-widget"
        >
          <div style={{padding: '1em'}}>
            <p>Floating widget content</p>
            <p>
              <input name="widgetInput" defaultValue="" data-testid="widget-input" />
              <button
                onClick={() => {
                  setIsOpen(false, {keepDismissed: true});
                }}
              >
                close
              </button>
            </p>
          </div>
        </FloatingWidget>
      </div>
      <div>
        <label htmlFor="other-input">Other input</label>
        <input
          name="otherInput"
          type="text"
          id="other-input"
          defaultValue=""
          data-testid="other-input"
        />
      </div>
    </>
  );
};

export const Default = {
  render: () => <FloatingWidgetExample />,
};

export const FocusReferenceInput = {
  name: 'Focus reference input',
  render: () => <FloatingWidgetExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('Reference'));
    const reference = canvas.getByTestId('reference');
    await waitForFocus(reference);
    await expect(canvas.getByRole('dialog')).toBeVisible();
  },
};

export const TypingClosesWidget = {
  name: 'Type in reference input closes widget',
  render: () => <FloatingWidgetExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    const reference = canvas.getByTestId('reference');
    await reference.focus();
    await expect(canvas.getByRole('dialog')).toBeVisible();
    await userEvent.type(reference, 'Some input');
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};

export const DismissAndReopenWithClick = {
  name: 'Dismiss widget and re-open with click',
  render: () => <FloatingWidgetExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const reference = canvas.getByTestId('reference');
    await userEvent.click(reference);
    await waitForFocus(reference);
    await expect(canvas.getByRole('dialog')).toBeVisible();
    await userEvent.keyboard('[Escape]');
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await waitForFocus(reference);
    await userEvent.click(reference);
    await waitForFocus(reference);
    await expect(canvas.getByRole('dialog')).toBeVisible();
  },
};

export const TabNavigateToNestedInput = {
  name: 'Tab navigate to widget input',
  render: () => <FloatingWidgetExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const reference = canvas.getByTestId('reference');
    await userEvent.click(reference);
    await expect(canvas.getByRole('dialog')).toBeVisible();
    const widgetInput = await canvas.findByTestId('widget-input');
    expect(widgetInput).toBeVisible();
    expect(widgetInput).not.toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('dialog')).toBeVisible();
    expect(await canvas.findByTestId('widget-input')).toBeVisible();
    await waitForFocus(canvas.getByTestId('widget-input'));
  },
};

export const SubmitWidgetClosesWidget = {
  name: 'Submit widget and close widget',
  render: () => <FloatingWidgetExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const reference = canvas.getByTestId('reference');
    await userEvent.click(reference);
    await expect(canvas.getByRole('dialog')).toBeVisible();
    const button = canvas.getByRole('button', {name: 'close'});
    await expect(button).toBeVisible();
    await userEvent.click(button);
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await waitForFocus(reference);
  },
};

export const FocusOtherInputClosesWidget = {
  name: 'Focus other input closes widget',
  render: () => <FloatingWidgetExample />,
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('open widget', async () => {
      const reference = canvas.getByTestId('reference');
      await userEvent.click(reference);
      await expect(canvas.getByRole('dialog')).toBeVisible();
      expect(reference).toHaveFocus(); // because it was clicked
    });

    await step('focus widget input', async () => {
      const widgetInput = await canvas.findByTestId('widget-input');
      expect(widgetInput).toBeVisible();
      console.group('widget input / before');
      console.log(document.activeElement);
      console.groupEnd();
      await userEvent.tab();
      console.group('widget input / after tab');
      console.log(document.activeElement);
      console.groupEnd();
      await sleep(100);
      console.group('widget input / after sleep');
      console.log(document.activeElement);
      console.groupEnd();
      await waitForFocus(canvas.getByTestId('widget-input'));
    });

    await step('focus button', async () => {
      const button = await canvas.findByRole('button');
      expect(button).toBeVisible();
      console.group('button / before');
      console.log(document.activeElement);
      console.groupEnd();
      await userEvent.tab();
      console.group('button / after tab');
      console.log(document.activeElement);
      console.groupEnd();
      await sleep(100);
      console.group('button / after sleep');
      console.log(document.activeElement);
      console.groupEnd();
      await waitForFocus(canvas.getByRole('button'));
    });

    await step('Focus input outside widget', async () => {
      await userEvent.tab();
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
      await waitForFocus(canvas.getByTestId('other-input'));
    });
  },
};

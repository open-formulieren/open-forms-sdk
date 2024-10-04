import {Alert} from '@utrecht/component-library-react';
import {withRouter} from 'storybook-addon-remix-react-router';

import ErrorBoundary from 'components/Errors/ErrorBoundary';
import Loader from 'components/Loader';
import {RadioField, TextField} from 'components/forms';
import {PermissionDenied} from 'errors';
import {FormikDecorator} from 'story-utils/decorators';

export default {
  title: 'NL DS / Collages',
  decorators: [FormikDecorator, withRouter],
};

export const Feedback = {
  args: {
    useOverrides: false,
    sharedBackgroundColorInfo: '#D9EBF7',
    sharedBackgroundColorWarning: '#FFF3CD',
    sharedBackgroundColorDanger: '#F8D7DA',
    sharedBackgroundColorSuccess: '#DDFFDD',
    sharedColorInfo: '#007BC7',
    sharedColorWarning: '#E17000',
    sharedColorDanger: '#D52B1E',
    sharedColorSuccess: 'green',
    sharedBackgroundColorActive: '#AAAAAA',
    sharedBackgroundColorInactive: '#EEEEEE',
    ofColorPrimary: '#01689B',
    ofColorSecondary: '#CEE0EA',
  },
  parameters: {
    formik: {
      initialValues: {
        textinput: 'some text',
        radio: '',
      },
      initialErrors: {
        textinput: 'Computer says no.',
        radio: 'Computer says no.',
      },
      initialTouched: {
        textinput: true,
        radio: true,
      },
    },
  },
  render: args => (
    <table
      style={
        args.useOverrides
          ? {
              '--utrecht-alert-icon-info-color': args.sharedColorInfo,
              '--utrecht-alert-icon-warning-color': args.sharedColorWarning,
              '--utrecht-alert-icon-error-color': args.sharedColorDanger,
              '--utrecht-alert-icon-ok-color': args.sharedColorSuccess,
              '--utrecht-alert-info-background-color': args.sharedBackgroundColorInfo,
              '--utrecht-alert-warning-background-color': args.sharedBackgroundColorWarning,
              '--utrecht-alert-error-background-color': args.sharedBackgroundColorDanger,
              '--utrecht-alert-ok-background-color': args.sharedBackgroundColorSuccess,
              '--utrecht-form-field-description-invalid-color': args.sharedColorDanger,
              '--utrecht-form-field-invalid-border-inline-start-color': args.sharedColorDanger,
              '--of-color-info': args.sharedColorInfo,
              '--of-color-warning': args.sharedColorWarning,
              '--of-color-danger': args.sharedColorDanger,
              '--of-color-success': args.sharedColorSuccess,
              '--of-color-primary': args.ofColorPrimary,
              '--of-color-secondary': args.ofColorSecondary,
              '--utrecht-feedback-danger-fill-background-color': args.sharedColorDanger,
              '--utrecht-feedback-warning-fill-background-color': args.sharedColorWarning,
              '--utrecht-feedback-safe-fill-background-color': args.sharedColorSuccess,
              '--utrecht-feedback-neutral-fill-background-color': args.sharedColorInfo,
              '--utrecht-feedback-valid-fill-background-color': args.sharedColorSuccess,
              '--utrecht-feedback-invalid-fill-background-color': args.sharedColorDanger,
              '--utrecht-feedback-error-fill-background-color': args.sharedColorDanger,
              '--utrecht-feedback-success-fill-background-color': args.sharedColorSuccess,
              '--utrecht-feedback-active-fill-background-color': args.sharedBackgroundColorActive,
              '--utrecht-feedback-inactive-fill-background-color':
                args.sharedBackgroundColorInactive,
            }
          : undefined
      }
    >
      <thead>
        <tr>
          <th style={{inlineSize: '15%', textAlign: 'start'}}>Component</th>
          <th style={{inlineSize: '15%', textAlign: 'start'}}>variant</th>
          <th>Preview</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th colSpan={3}>Alerts</th>
        </tr>
        <tr>
          <td>Alert</td>
          <td>info</td>
          <td>
            <Alert type="info">If you kick the thing, it might explode.</Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>info & icon</td>
          <td>
            <Alert type="info" icon={<i className="fa fas fa-exclamation-circle" />}>
              If you kick the thing, it might explode.
            </Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>warning</td>
          <td>
            <Alert type="warning">It will explode.</Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>warning & icon</td>
          <td>
            <Alert type="warning" icon={<i className="fa fas fa-info-circle" />}>
              It will explode.
            </Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>error</td>
          <td>
            <Alert type="error">It exploded.</Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>error & icon</td>
          <td>
            <Alert type="error" icon={<i className="fa fas fa-exclamation-triangle" />}>
              It exploded.
            </Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>ok</td>
          <td>
            <Alert type="ok">False alarm</Alert>
          </td>
        </tr>

        <tr>
          <td>Alert</td>
          <td>ok & icon</td>
          <td>
            <Alert type="ok" icon={<i className="fa fas fa-check-circle" />}>
              False alarm
            </Alert>
          </td>
        </tr>

        <tr>
          <th colSpan={3}>Forms</th>
        </tr>

        <tr>
          <td>TextField</td>
          <td>validation errors</td>
          <td>
            <TextField name="textinput" label="Hack away" />
          </td>
        </tr>

        <tr>
          <td>Radio</td>
          <td>validation errors</td>
          <td>
            <RadioField
              name="radio"
              label="It's bwoken"
              options={[
                {value: '1', label: 'Eentje'},
                {value: '2', label: 'is geentje'},
              ]}
            />
          </td>
        </tr>

        <tr>
          <th colSpan={3}>Loaders</th>
        </tr>

        <tr>
          <td>Loader</td>
          <td>-</td>
          <td>
            <Loader modifiers={['only-child']} />
          </td>
        </tr>

        <tr>
          <td>Loader</td>
          <td>gray</td>
          <td>
            <Loader modifiers={['only-child', 'gray']} />
          </td>
        </tr>

        <tr>
          <th colSpan={3}>Misc</th>
        </tr>

        <tr>
          <td>ErrorBoundary</td>
          <td>Generic</td>
          <td>
            <ErrorBoundary>
              <Broken />
            </ErrorBoundary>
          </td>
        </tr>

        <tr>
          <td>ErrorBoundary</td>
          <td>PermissionDenied</td>
          <td>
            <ErrorBoundary>
              <Broken2 />
            </ErrorBoundary>
          </td>
        </tr>

        <tr>
          <th colSpan={3}>Status badges</th>
        </tr>

        {[
          'danger',
          'warning',
          'safe',
          'neutral',
          'valid',
          'invalid',
          'error',
          'success',
          'active',
          'inactive',
        ].map(variant => (
          <tr>
            <td>Status badge</td>
            <td>{variant}</td>
            <td>
              <div className={`utrecht-badge-status utrecht-badge-status--${variant}`}>status</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

const Broken = () => {
  throw new Error();
};

const Broken2 = () => {
  throw new PermissionDenied('show passport pls');
};

import {Alert} from '@utrecht/component-library-react';

import {TextField} from 'components/forms';
import {FormikDecorator} from 'story-utils/decorators';

export default {
  title: 'NL DS / Collages',
  decorators: [FormikDecorator],
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
  },
  parameters: {
    formik: {
      initialValues: {
        textinput: 'some text',
      },
      initialErrors: {
        textinput: 'invalid',
      },
      initialTouched: {
        textinput: true,
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
          <td>TextField</td>
          <td>validation errors</td>
          <td>
            <TextField name="textinput" label="Hack away" />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

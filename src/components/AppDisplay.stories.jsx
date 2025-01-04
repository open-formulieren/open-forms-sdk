import Body from 'components/Body';

import {AppDisplay} from './AppDisplay';

export default {
  title: 'Composites / App display',
  component: AppDisplay,
  argTypes: {
    appDebug: {control: 'boolean'},
  },
};

const SpacedDiv = ({children}) => (
  <div
    style={{
      background: 'white',
      margin: '.5em',
      padding: '1em',
      width: '100%',
    }}
  >
    {children}
  </div>
);

export const Default = {
  render: ({appDebug}) => (
    <AppDisplay
      router={
        <SpacedDiv>
          <Body>{'<Router>'}</Body>
        </SpacedDiv>
      }
      languageSwitcher={
        <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <Body>{'<Language switcher>'}</Body>
        </div>
      }
      appDebug={
        appDebug ? (
          <SpacedDiv>
            {' '}
            <Body>{'<App debug>'}</Body>{' '}
          </SpacedDiv>
        ) : null
      }
    />
  ),
  args: {
    appDebug: false,
  },
  argTypes: {
    router: {table: {disable: true}},
    languageSwitcher: {table: {disable: true}},
  },
};

import type {Meta, StoryObj} from '@storybook/react';

import Body from '@/components/Body';

import AppDisplay from './AppDisplay';

export default {
  title: 'Composites / App display',
  component: AppDisplay,
  argTypes: {
    appDebug: {control: 'boolean'},
  },
} satisfies Meta<typeof AppDisplay>;

type Story = StoryObj<typeof AppDisplay>;

const SpacedDiv: React.FC<React.PropsWithChildren> = ({children}) => (
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

export const Default: Story = {
  render: ({appDebug}) => (
    <AppDisplay
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
    >
      <SpacedDiv>
        <Body>{'<Router>'}</Body>
      </SpacedDiv>
    </AppDisplay>
  ),
  args: {
    appDebug: false,
  },
  argTypes: {
    router: {table: {disable: true}},
    languageSwitcher: {table: {disable: true}},
  },
};

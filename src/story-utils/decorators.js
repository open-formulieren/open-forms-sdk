import {MemoryRouter} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {BASE_URL} from 'story-utils/mocks';

export const ConfigDecorator = (Story, {args}) => (
  <ConfigContext.Provider value={{baseUrl: args.baseUrl || BASE_URL}}>
    <Story />
  </ConfigContext.Provider>
);

export const RouterDecorator = (Story, {args}) => (
  <MemoryRouter {...args}>
    <Story />
  </MemoryRouter>
);

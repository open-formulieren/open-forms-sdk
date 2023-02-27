import {MemoryRouter, Route, Switch} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {BASE_URL} from 'story-utils/mocks';

export const ConfigDecorator = (Story, {args}) => (
  <ConfigContext.Provider value={{baseUrl: BASE_URL}}>
    <Story />
  </ConfigContext.Provider>
);

const RouterStoryWrapper = ({route = '', children}) => {
  if (!route) {
    return <>{children}</>;
  }
  return (
    <Switch>
      <Route path={route}>{children}</Route>
    </Switch>
  );
};

export const RouterDecorator = (Story, {args: {routerArgs = {}}}) => {
  return (
    <MemoryRouter {...routerArgs}>
      <RouterStoryWrapper route={routerArgs.route}>
        <Story />
      </RouterStoryWrapper>
    </MemoryRouter>
  );
};

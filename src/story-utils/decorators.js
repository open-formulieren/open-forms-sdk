import {Formik} from 'formik';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {BASE_URL} from 'api-mocks';
import {LiteralsProvider} from 'components/Literal';

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
    <Routes>
      <Route path={route} element={children} />
    </Routes>
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

export const FormikDecorator = (Story, context) => {
  const initialValues = context.parameters?.formik?.initialValues || {};
  const initialErrors = context.parameters?.formik?.initialErrors || {};
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      enableReinitialize
      onSubmit={(values, formikHelpers) => console.log(values, formikHelpers)}
    >
      <form>
        <Story />
      </form>
    </Formik>
  );
};

export const LiteralDecorator = (Story, {args}) => (
  <LiteralsProvider
    literals={{
      previousText: {
        resolved: args.previousText,
      },
      beginText: {
        resolved: args.beginText,
      },
      changeText: {
        resolved: args.changeText,
      },
      confirmText: {
        resolved: args.confirmText,
      },
    }}
  >
    <Story />
  </LiteralsProvider>
);

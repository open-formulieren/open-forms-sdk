import appointmentsComponentHook from './hooks/appointments';

/**
 * Hook to hook into the component creation flow.
 *
 * Used for the appointments configuration.
 */
function componentHook() {
  const component = this;
  appointmentsComponentHook(component);
}

const hooks = {
  component: componentHook,
};

export default hooks;

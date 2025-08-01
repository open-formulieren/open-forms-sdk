import type {DOMRouterOpts} from 'react-router';

export {default} from './app';

// Keep the constants around for when we inevitably have to ugprade to React Router v8
export const FUTURE_FLAGS: DOMRouterOpts['future'] = {};
export const PROVIDER_FUTURE_FLAGS = {};

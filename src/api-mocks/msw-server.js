import {setupServer} from 'msw/node';

// set up API mock server
const mswServer = setupServer();

export default mswServer;

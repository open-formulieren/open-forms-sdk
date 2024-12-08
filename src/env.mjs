/**
 * Handle the env in both (legacy) CRA and the new Vite-based setup.
 *
 * CRA is `process.env` based, using NodeJS, while ViteJS used import.meta from the
 * module system.
 */

let env;
let envVarPrefix = 'VITE';

let DEBUG = false;

// Support both CRA and Vite for the time being.
try {
  env = process.env;
  // it's legacy create-react-app
  DEBUG = env.NODE_ENV === 'development';
  envVarPrefix = 'REACT_APP';
} catch (error) {
  if (error instanceof ReferenceError) {
    // it's ViteJS, which doesn't know `process`
    env = import.meta.env;
    DEBUG = env.MODE === 'development';
  } else {
    throw error;
  }
}

const getEnv = name => {
  const fullName = `${envVarPrefix}_${name}`;
  return env[fullName];
};

export {DEBUG, env, getEnv};

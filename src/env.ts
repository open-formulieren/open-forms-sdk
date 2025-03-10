/**
 * Abstract away reading from the env.
 *
 * Envvars tend to be tightly coupled around build tools. While we only support Vite
 * at this moment, it might be useful to avoid leaking the build tool in source code
 * directly in case another tool starts getting better supported in the future.
 */

const env = import.meta.env;
const envVarPrefix = 'VITE';
const DEBUG = env.MODE === 'development';

const getEnv = (name: string): string | undefined => {
  const fullName = `${envVarPrefix}_${name}`;
  return env[fullName];
};

export {DEBUG, env, getEnv};

// what accessEnv does:
// it accesses a variable inside of process.env, throwing error if doesn't exist
//  always run this methos in advance (i.e upon initialization) so that the error is thrown immediately
// caching the values improves performances - accessing process.env many times is bad

const cache: { [key: string]: string } = {};

const accessEnv = (key: string, defaultValue: string) => {
  if (!(key in process.env) || typeof process.env[key] === undefined ) {
    if (defaultValue) return defaultValue;
    throw new Error(`${key} not found in process.env!`);
  }

  if (!(key in cache)) {
    cache[key] = <string>process.env[key];
  }

  return cache[key];
}

export default accessEnv;
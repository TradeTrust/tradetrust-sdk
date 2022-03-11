import debug from "debug";

// not using .extends because of next.js resolve modules bug where its picking up old version of debug
export const trace = (namespace: string) => debug(`dnsprove:trace:${namespace}`);
export const info = (namespace: string) => debug(`dnsprove:info:${namespace}`);
export const error = (namespace: string) => debug(`dnsprove:error:${namespace}`);

export const getLogger = (namespace: string) => ({
  trace: trace(namespace),
  info: info(namespace),
  error: error(namespace),
});

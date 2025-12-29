import gray from "chalk";
export const isDebug = 
  process.env.DEBUG === 'true' ||
  process.env.DEBUG === '1';

export function debug(...args: unknown[]) {

  if(isDebug) {
    gray(console.log('[DEBUG]', ...args));
  }
}

export function info(...args: unknown[]) {
  console.log(...args);
}


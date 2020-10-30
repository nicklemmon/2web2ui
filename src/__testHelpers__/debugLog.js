const { log } = console;

export default function debugLog(...args) {
  process.env.DEBUG && log(...args);
}

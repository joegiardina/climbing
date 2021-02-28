const noop = () => {};

const LEVELS = [
  'debug',
  'info',
  'error',
];
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const LOG_INDEX = LEVELS.indexOf(LOG_LEVEL);

export default function(logPrefix) {
  const logger = {};
  for (let i = 0; i < LEVELS.length; i++) {
    const level = LEVELS[i];
    if (i < LOG_INDEX) {
      logger[level] = noop;
    } else {
      logger[level] = msg => console.log(`${level.toUpperCase()}: ${logPrefix ? `[${logPrefix}] ` : ''}${msg}`)
    }
  }

  return logger;
}

import { LogLevel } from '@nestjs/common';
import 'dotenv/config';

const levels: LogLevel[] = [
  'fatal',
  'error',
  'warn',
  'log',
  'debug',
  'verbose',
];

const logLevelIndex = getLogLevelIndex();

export const logLevels = levels.slice(0, logLevelIndex + 1);

function getLogLevelIndex() {
  const DEFAULT_LEVEL = 2;
  const logLevelEnv = process.env?.LOG_LEVEL;

  if (logLevelEnv == undefined) return DEFAULT_LEVEL;

  const logLevelNumber = parseInt(logLevelEnv);

  if (
    !isNaN(logLevelNumber) &&
    logLevelNumber < levels.length &&
    logLevelNumber > -1
  )
    return logLevelNumber;

  const logLevelIndex = levels.indexOf(logLevelEnv as LogLevel);

  if (logLevelIndex != -1) return logLevelIndex;

  return DEFAULT_LEVEL;
}

import {
  LoggerService as LoggerServiceDefault,
  Injectable,
  ConsoleLogger,
  Scope,
  LogLevel,
} from '@nestjs/common';
import { EOL } from 'os';
import 'dotenv/config';
import { logLevels } from '../common/log-levels';
import { Log } from './log';

const defaultLog = new Log('log');
const errorLog = new Log('error');

@Injectable({ scope: Scope.TRANSIENT })
@Injectable()
export class LoggerService
  extends ConsoleLogger
  implements LoggerServiceDefault
{
  log = this.createLogFunction('log');
  fatal = this.createLogFunction('fatal', errorLog);
  error = this.createLogFunction('error', errorLog);
  warn = this.createLogFunction('warn');
  debug = this.createLogFunction('debug');

  private createLogFunction(level: LogLevel, ...extraLogs: Log[]) {
    if (!logLevels.includes(level)) return () => {};

    return async (message: string, context?: string) => {
      const formattedMessage = formatMessage(level, message, context);

      await Promise.all([
        defaultLog.write(formattedMessage),
        ...extraLogs.map((log) => log.write(formattedMessage)),
      ]);

      this.writeSuperLog(level, message, context);
    };
  }

  private writeSuperLog(level: LogLevel, message: string, context?: string) {
    if (context == undefined) super[level](message);
    else super[level](message, context);
  }
}

function formatMessage(level: LogLevel, message: string, context?: string) {
  const pid = process.pid,
    date = new Date().toISOString(),
    levelString = level.toUpperCase(),
    contextString = context ? `[${context}]` : '';

  return `[HL-REST] ${pid} - ${date} ${levelString} ${contextString} ${message}${EOL}`;
}

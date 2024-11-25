import { createWriteStream, mkdirSync, WriteStream } from 'fs';
import { CreateWriteStreamOptions, rename, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const LOGS_DIR = 'logs';
const LOG_STREAM_OPTIONS: CreateWriteStreamOptions = { encoding: 'utf-8' };
const LOG_EXTENSION = '.log';

const LOG_LIMIT_MULTIPLIER = 1024;
const LOG_LIMIT = process.env?.LOG_LIMIT_KB;
const logLimit = LOG_LIMIT_MULTIPLIER * (parseInt(LOG_LIMIT) ? +LOG_LIMIT : 0);
const isLimit = logLimit > 0;

const root = process.cwd();
mkdirSync(resolve(root, LOGS_DIR), { recursive: true });

export class Log {
  private logName: string;
  private logFile: string;
  private logStream: WriteStream;

  constructor(logName = 'log') {
    this.logName = logName;
    this.logFile = this.getLogPath();
    this.logStream = this.createLogStream();
  }

  public async write(message: string) {
    const shouldResetLog =
      isLimit && this.logStream.bytesWritten + message.length >= logLimit;

    if (shouldResetLog) {
      await this.resetLog();
    }

    this.logStream.write(message);
  }

  private clearLogFile() {
    return writeFile(this.logFile, '', { flag: 'w+' });
  }

  private async resetLog() {
    this.logStream.end();

    const newFile = this.getNewLogPath();
    await rename(this.logFile, newFile);

    this.logStream = this.createLogStream();

    await this.clearLogFile();
  }

  private createLogStream(path = this.logFile, options = LOG_STREAM_OPTIONS) {
    return createWriteStream(path, options);
  }

  private getNewLogPath() {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const timeString = [year, month, day, hour, minutes, seconds]
      .map((t) => ('' + t).padStart(2, '0'))
      .join('-');

    const fileString = this.logName + '-' + timeString;

    return this.getLogPath(fileString);
  }

  private getLogPath(logName = this.logName) {
    return resolve(root, join(LOGS_DIR, logName + LOG_EXTENSION));
  }
}

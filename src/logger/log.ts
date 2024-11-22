import { createWriteStream, mkdirSync, WriteStream } from 'fs';
import { CreateWriteStreamOptions, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const LOGS_DIR = 'logs';
const LOG_STREAM_OPTIONS: CreateWriteStreamOptions = { encoding: 'utf-8' };

const LOG_LIMIT_MULTIPLIER = 1024;
const LOG_LIMIT = process.env?.LOG_LIMIT_KB;
const logLimit = LOG_LIMIT_MULTIPLIER * (parseInt(LOG_LIMIT) ? +LOG_LIMIT : 0);
const isLimit = logLimit > 0;

const root = process.cwd();
mkdirSync(resolve(root, LOGS_DIR), { recursive: true });

export class Log {
  private logFile: string;
  private logStream: WriteStream;

  constructor(logName = 'log') {
    this.logFile = resolve(root, join(LOGS_DIR, logName + '.log'));
    this.resetLogStream();
  }

  public async write(message: string) {
    const shouldResetLog =
      isLimit && this.logStream.bytesWritten + message.length >= logLimit;

    if (shouldResetLog) {
      await this.resetLogStream();
    }

    this.logStream.write(message);
  }

  private async resetLogStream() {
    this.logStream?.close();
    await this.resetLogFile();
    this.createLogStream();
  }

  private resetLogFile() {
    return writeFile(this.logFile, '', { flag: 'w+' });
  }

  private createLogStream(options = LOG_STREAM_OPTIONS) {
    this.logStream = createWriteStream(this.logFile, options);
  }
}

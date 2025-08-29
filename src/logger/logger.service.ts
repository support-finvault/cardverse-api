import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface DMSErrorModel {
  logger: string;
  level: string;
  user: string;
  host: string;
  logtime: string;
  http: {
    session_id: string;
    http_method: string;
    url: string;
    url_referrer: string;
    user_agent: string;
    user_host_address: string;
    request_headers: IncomingHttpHeaders;
    form_params: [];
  };
  dms: {
    Application: string;
    HostedId: string;
    Message: string;
    Source: string;
    StackTrace: string;
    LoggedInUserId: string;
    CreatedBy: string;
    PrimaryKey: string;
    ConsumerIP: string;
    ApplicationName: string;
  };
}

export class LoggerService {
  private readonly infoInstance: winston.Logger;
  private readonly errInstance: winston.Logger;

  public constructor() {
    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({ label: process.env.APP_NAME }),
      winston.format.json(),
    );
    let logFileName: string | undefined = process.env.LOG_PATH;
    if (!logFileName) {
      logFileName = './defaultLogFile.log';
    }
    this.infoInstance = winston.createLogger({
      level: 'info',
      format,
      transports: [
        new DailyRotateFile({
          filename: logFileName,
          datePattern: 'YYYY-MM-DD',
          maxFiles: 10,
          level: 'info',
        }),
      ],
    });
    this.errInstance = winston.createLogger({
      level: 'error',
      format,
      transports: [
        new DailyRotateFile({
          filename: logFileName,
          datePattern: 'YYYY-MM-DD',
          maxFiles: 10,
          level: 'info',
        }),
      ],
    });
  }

  public info(error: any, req: Request) {
    this.infoInstance.info(error);
    const errorObj = this.generateErrorModal('info', error, req);
  }

  public error(error: any, req: Request) {
    const errorObj = this.generateErrorModal('error', error, req);
    this.errInstance.error(errorObj);
  }

  public warn(error: any, req: Request) {
    const errorObj = this.generateErrorModal('warn', error, req);
    this.errInstance.warn(error);
  }

  generateErrorModal(level: string, err: any, req: Request): DMSErrorModel {
    const errObject: DMSErrorModel = {
      logger: 'FinVault.ExceptionLogger.Logger',
      level: err.level ? err.level : level,
      user: 'FinVaultService',
      host: `${process.env.HOST}`,
      logtime: new Date().toLocaleString(),
      http: {
        session_id: '',
        http_method: req.method,
        url: req.url,
        url_referrer: req.headers && req.headers.referer,
        user_agent: req.headers && req.headers['user-agent'],
        user_host_address: req.headers && req.headers.host,
        request_headers: req.headers,
        form_params: [],
      },
      dms: {
        Application: `${process.env.APP_NAME}`,
        HostedId: `${process.env.HOST}:${process.env.PORT}`,
        Message: err.message,
        Source: err.source,
        StackTrace: err.stack,
        LoggedInUserId: err.loggedInUserId,
        CreatedBy: err.createdBy,
        PrimaryKey: err.primaryKey,
        ConsumerIP:
          req.connection !== undefined && req.connection !== null
            ? req.connection.remoteAddress
            : '',
        ApplicationName: err.applicationName,
      },
    };

    return errObject;
  }
}

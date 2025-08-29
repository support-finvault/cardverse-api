import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logRequest(req);
    next();
  }

  logRequest(req: Request): void {
    const logData = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      baseUrl: req.baseUrl,
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body,
      ip: req.ip,
    };

    console.log('📥 Incoming Request:\n', JSON.stringify(logData, null, 2));
  }
}

// src/common/middleware/decryption.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class DecryptionMiddleware implements NestMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { encryptedKey, encryptedData, iv } = req.body || {};

    if (!encryptedKey || !encryptedData || !iv) {
      return res.status(400).json({ message: 'Missing encrypted payload' });
    }

    try {
      const decrypted = this.encryptionService.decryptHybridPayload({
        encryptedKey,
        encryptedData,
        iv,
      });

      req.body = JSON.parse(decrypted);
      next();
    } catch (error) {
      console.error('Decryption failed:', error);
      return res.status(400).json({ message: 'Decryption failed' });
    }
  }
}

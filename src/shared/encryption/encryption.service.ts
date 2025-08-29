import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EncryptionService {
  private readonly privateKey: crypto.KeyObject;
  private readonly publicKey: crypto.KeyObject;
  private readonly isProd: boolean;

  constructor(private configService: ConfigService) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    this.isProd = isProd;

    const privatePem = isProd
      ? this.configService.get<string>('PRIVATE_KEY_PEM')
      : fs.readFileSync(
          path.join(
            process.cwd(),
            'src/shared/encryption/keys/private_key.pem',
          ),
          'utf-8',
        );

    const publicPem = isProd
      ? this.configService.get<string>('PUBLIC_KEY_PEM')
      : fs.readFileSync(
          path.join(process.cwd(), 'src/shared/encryption/keys/public_key.pem'),
          'utf-8',
        );

    this.privateKey = crypto.createPrivateKey(privatePem);
    this.publicKey = crypto.createPublicKey(publicPem);
  }

  getPublicKey(): string {
    return this.publicKey.export({ type: 'pkcs1', format: 'pem' }).toString();
  }

  decryptHybridPayload(encrypted: {
    encryptedKey: string;
    encryptedData: string;
    iv: string;
  }): string {
    const { encryptedKey, encryptedData, iv } = encrypted;

    const aesKey = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedKey, 'base64'),
    );

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      aesKey,
      Buffer.from(iv, 'base64'),
    );

    let decrypted = decipher.update(Buffer.from(encryptedData, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  encryptHybridPayloadForUser(
    plaintext: string,
    userPublicKeyPem: string,
  ): {
    encryptedData: string;
    encryptedKey: string;
    iv: string;
  } {
    // Step 1: Generate AES-256 key and IV
    const aesKey = crypto.randomBytes(32); // 256 bits
    const iv = crypto.randomBytes(16); // 128 bits

    // Step 2: Encrypt data using AES
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encrypted = cipher.update(plaintext, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Step 3: Encrypt AES key using user's RSA public key
    const encryptedKey = crypto.publicEncrypt(
      {
        key: userPublicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      aesKey,
    );

    return {
      encryptedData: encrypted.toString('base64'),
      encryptedKey: encryptedKey.toString('base64'),
      iv: iv.toString('base64'),
    };
  }
}

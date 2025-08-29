import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserKey } from 'src/app/users/entities/userKeys.entity';
import { EncryptionService } from 'src/shared/encryption/encryption.service';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  private readonly encryptionEnabled: boolean;

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.encryptionEnabled =
      this.configService.get('ENCRYPTION_ENABLED') === 'true';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Bypass if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || !this.encryptionEnabled) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const deviceId = request.headers['x-device-id'];
    const user = request.user;

    if (!user || !deviceId || !Array.isArray(user.keys)) {
      console.warn('Missing user, deviceId, or keys');
      return next.handle();
    }

    const matchedKey: UserKey = user.keys.find((k) => k.deviceId === deviceId);

    if (!matchedKey?.publicKeyPem) {
      console.warn(`Route: [${request.method}] ${request.originalUrl}`);
      console.warn(`No public key found for device: ${deviceId}`);
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return this.encryptionService.encryptHybridPayloadForUser(
          JSON.stringify(data),
          matchedKey.publicKeyPem,
        );
      }),
    );
  }
}

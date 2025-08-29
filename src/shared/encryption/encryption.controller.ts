import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';

@ApiTags('Encryption')
@Controller('encryption')
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Get('public-key')
  @ApiOperation({ summary: 'Get the public RSA key used for encryption' })
  @ApiResponse({
    status: 200,
    description: 'Returns the PEM formatted public key',
  })
  getPublicKey(): string {
    return this.encryptionService.getPublicKey();
  }
}

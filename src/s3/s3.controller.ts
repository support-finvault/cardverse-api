import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import { S3Service } from './s3.service';

@Controller('s3')
@ApiTags('S3')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get('upload-url')
  @ApiOperation({
    summary: 'Generate a pre-signed URL for uploading a document',
  })
  @ApiQuery({
    name: 'fileName',
    type: String,
    required: true,
    description: 'Name of the file to upload',
  })
  @ApiQuery({
    name: 'contentType',
    type: String,
    required: true,
    description: 'MIME type of the file (e.g., application/pdf)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a pre-signed URL and the object key',
    schema: {
      example: {
        key: 'documents/user-id/filename.pdf',
        signedUrl: 'https://s3.amazonaws.com/your-bucket/...',
      },
    },
  })
  async getUploadUrl(
    @Request() req,
    @Query('fileName') fileName: string,
    @Query('contentType') contentType: string,
  ) {
    return this.s3Service.getUploadUrl(req.user.id, fileName, contentType);
  }

  @Get('download-url')
  @ApiOperation({
    summary: 'Generate a pre-signed URL for downloading a document',
  })
  @ApiQuery({
    name: 'fileName',
    type: String,
    required: true,
    description: 'Name of the file to download',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a pre-signed URL and the object key',
    schema: {
      example: {
        key: 'documents/user-id/filename.pdf',
        signedUrl: 'https://s3.amazonaws.com/your-bucket/...',
      },
    },
  })
  async getDownloadUrl(@Request() req, @Query('fileName') fileName: string) {
    return this.s3Service.getDownloadUrl(req.user.id, fileName);
  }
}

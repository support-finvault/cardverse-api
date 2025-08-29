import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a push notification using Expo' })
  @ApiBody({ type: SendNotificationDto })
  async sendNotification(@Body() body: SendNotificationDto) {
    return this.notificationService.sendPushNotification(
      body.token,
      body.title ?? '',
      body.message,
      {
        subtitle: body.subtitle,
        ...body.data,
      },
      {
        sound: body.sound,
        priority: body.priority,
        ttl: body.ttl,
        channelId: body.channelId,
        badge: body.badge,
      },
    );
  }
}

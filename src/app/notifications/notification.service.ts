import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  private expo: Expo;
  private logger = new Logger(NotificationService.name);

  constructor() {
    this.expo = new Expo();
  }

  async sendPushNotification(
    token: string,
    title: string,
    message: string,
    data: any = {},
    options: {
      sound?: string;
      priority?: 'default' | 'normal' | 'high';
      ttl?: number;
      channelId?: string;
      badge?: number;
    } = {},
  ): Promise<ExpoPushTicket[]> {
    if (!Expo.isExpoPushToken(token)) {
      this.logger.warn(`Invalid Expo push token: ${token}`);
      return [];
    }

    const pushMessage: ExpoPushMessage = {
      to: token,
      sound: options.sound ?? 'default',
      title,
      body: message,
      data,
      priority: options.priority ?? 'high',
      ttl: options.ttl,
      channelId: options.channelId,
      badge: options.badge,
    };

    try {
      const chunks = this.expo.chunkPushNotifications([pushMessage]);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      }

      return tickets;
    } catch (error) {
      this.logger.error('Error sending push notification', error);
      throw error;
    }
  }
}

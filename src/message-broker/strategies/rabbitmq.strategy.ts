import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { MessageQueueStrategy } from '../interfaces/message-queue-strategy.interface';

@Injectable()
export class RabbitMQStrategy implements MessageQueueStrategy {
  private channel: amqp.Channel;

  constructor(private config: ConfigService) {}

  async init() {
    const connection = await amqp.connect(this.config.get('RABBITMQ_URL'));
    this.channel = await connection.createChannel();
    const queues = this.config.get<string>('QUEUE_NAMES').split(',');
    for (const queue of queues) {
      await this.channel.assertQueue(queue);
    }
  }

  async send(queueName: string, message: any, retries = 3): Promise<void> {
    const buffer = Buffer.from(JSON.stringify(message));
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.channel.sendToQueue(queueName, buffer);
        return;
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      }
    }
  }
}

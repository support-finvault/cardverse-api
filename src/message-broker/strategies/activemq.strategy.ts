import { Injectable } from '@nestjs/common';
import * as stompit from 'stompit';
import { ConfigService } from '@nestjs/config';
import { MessageQueueStrategy } from '../interfaces/message-queue-strategy.interface';

@Injectable()
export class ActiveMQStrategy implements MessageQueueStrategy {
  private client: stompit.Client;

  constructor(private config: ConfigService) {}

  async init() {
    const connectOptions = {
      host: this.config.get('ACTIVEMQ_HOST'),
      port: +this.config.get('ACTIVEMQ_PORT'),
      connectHeaders: {
        host: '/',
        login: this.config.get('ACTIVEMQ_USER'),
        passcode: this.config.get('ACTIVEMQ_PASSWORD'),
      },
    };

    this.client = await new Promise<stompit.Client>((resolve, reject) => {
      stompit.connect(connectOptions, (error, client) => {
        if (error) reject(error);
        else resolve(client);
      });
    });
  }

  async send(destination: string, message: any, retries = 3): Promise<void> {
    const payload = JSON.stringify(message);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const frame = this.client.send({
          destination,
          'content-type': 'application/json',
        });
        frame.write(payload);
        frame.end();
        return;
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      }
    }
  }
}

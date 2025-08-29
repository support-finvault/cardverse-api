import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { MessageQueueStrategy } from '../interfaces/message-queue-strategy.interface';

@Injectable()
export class KafkaStrategy implements MessageQueueStrategy {
  private producer: Producer;

  constructor(private config: ConfigService) {}

  async init() {
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: this.config.get('KAFKA_BROKERS').split(','),
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async send(topic: string, message: any, retries = 3): Promise<void> {
    const payload = JSON.stringify(message);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.producer.send({
          topic,
          messages: [{ value: payload }],
        });
        return;
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      }
    }
  }
}

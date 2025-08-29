import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQStrategy } from './strategies/rabbitmq.strategy';
import { KafkaStrategy } from './strategies/kafka.strategy';
import { ActiveMQStrategy } from './strategies/activemq.strategy';
import { MessageQueueStrategy } from './interfaces/message-queue-strategy.interface';

@Injectable()
export class MessageBrokerService {
  private strategy: MessageQueueStrategy;

  constructor(
    private config: ConfigService,
    private rabbit: RabbitMQStrategy,
    private kafka: KafkaStrategy,
    private activeMq: ActiveMQStrategy,
  ) {}

  async init() {
    const type = this.config.get<'rabbitmq' | 'kafka' | 'activemq'>(
      'QUEUE_TYPE',
    );

    switch (type) {
      case 'rabbitmq':
        this.strategy = this.rabbit;
        break;
      case 'kafka':
        this.strategy = this.kafka;
        break;
      case 'activemq':
        this.strategy = this.activeMq;
        break;
      default:
        throw new Error(`Unsupported queue type: ${type}`);
    }

    await this.strategy.init();
  }

  async send(queueOrTopic: string, message: any, retries = 3): Promise<void> {
    return this.strategy.send(queueOrTopic, message, retries);
  }
}

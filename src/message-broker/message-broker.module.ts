import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageBrokerService } from './message-broker.service';
import { RabbitMQStrategy } from './strategies/rabbitmq.strategy';
import { KafkaStrategy } from './strategies/kafka.strategy';
import { ActiveMQStrategy } from './strategies/activemq.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    MessageBrokerService,
    RabbitMQStrategy,
    KafkaStrategy,
    ActiveMQStrategy,
  ],
  exports: [MessageBrokerService],
})
export class MessageeBrokerModule implements OnModuleInit {
  constructor(private messageBrokerService: MessageBrokerService) {}

  async onModuleInit() {
    await this.messageBrokerService.init();
  }
}

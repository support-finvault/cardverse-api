export interface MessageQueueStrategy {
  init(): Promise<void>;
  send(queueOrTopic: string, message: any, retries?: number): Promise<void>;
}

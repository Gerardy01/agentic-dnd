import { EventEmitter } from 'events';

export interface IEventPublisherProvider {
  publish(eventName: string, data: any): void;
  subscribe(eventName: string, handler: (data: any) => void | Promise<void>): void;
}

export class EventEmitterPublisherProvider implements IEventPublisherProvider {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  publish(eventName: string, data: any): void {
    this.emitter.emit(eventName, data);
  }

  subscribe(eventName: string, handler: (data: any) => void | Promise<void>): void {
    this.emitter.on(eventName, async (data: any) => {
      try {
        await handler(data);
      } catch (err) {
        console.error(`Error handling event "${eventName}":`, err);
      }
    });
  }
}

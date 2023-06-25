import { Channel, WrappedBalancer } from "queueable";
import { EventEmitter } from "events";

export interface PubSubService {
    publish<T>(topic: string, data: T): void;
    subscribe<T>(topic: string, filter: (data: T) => boolean): WrappedBalancer<T>;
}

export class PubSubServiceEmitterImpl extends EventEmitter implements PubSubService {
    publish<T>(topic: string, data: T) {
        this.emit(topic, data);
    }

    subscribe<T>(topic: string, filter: (data: T) => boolean): WrappedBalancer<T> {
        const channel = new Channel<T>();

        const localListener = (data: T) => {
            if (filter(data)) channel.push(data);
        };

        this.on(topic, localListener);

        const iterable = channel.wrap(() => this.off(topic, localListener));
        return iterable;
    }
}


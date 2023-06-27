import { Channel, WrappedBalancer } from "queueable";
import { EventEmitter } from "events";
import { RedisClientType, createClient } from "redis";
import { PubSubRepository } from "../domain/repositories/pubsub.repository";
import { kRedisLink } from "../core/constants";



export class PubSubRepositoryEmitterImpl extends EventEmitter implements PubSubRepository {
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

export class PubSubRepositoryRedisImpl implements PubSubRepository {
    private readonly _pclient: RedisClientType;
    private readonly _sclient: RedisClientType;
    constructor() {
        this._pclient = createClient({ url: kRedisLink });
        this._pclient.connect().catch(console.error);
        this._sclient = createClient({ url: kRedisLink });
        this._sclient.connect().catch(console.error);
    }

    public publish<T>(topic: string, data: T) {
        this._pclient.publish(topic, JSON.stringify(data));
    }

    public subscribe<T>(topic: string, filter: (data: T) => boolean): WrappedBalancer<T> {
        const channel = new Channel<T>();

        const localListener = (data: string) => {
            const parsedData = JSON.parse(data) as T;
            if (filter(parsedData)) channel.push(parsedData);
        };

        this._sclient.subscribe(topic, localListener);

        const iterable = channel.wrap(() => {
            this._sclient.unsubscribe(topic, localListener);
        });

        return iterable;
    }
}

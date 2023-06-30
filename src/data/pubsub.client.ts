import { Channel, WrappedBalancer } from "queueable";
import { EventEmitter } from "events";
import { PubSubClient } from "../domain/pubsub.client";
import { kRedisLink } from "../core/constants";
import { Redis } from "ioredis";

export class PubSubClientEmitterImpl extends EventEmitter implements PubSubClient {
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

export class PubSubClientRedisImpl implements PubSubClient {
    private readonly _pclient: Redis;
    constructor() {
        this._pclient = new Redis(kRedisLink);
    }

    public publish<T>(topic: string, data: T) {
        this._pclient.publish(topic, JSON.stringify(data));
    }

    public subscribe<T>(topic: string, filter: (data: T) => boolean): WrappedBalancer<T> {
        const channel = new Channel<T>();

        const sclient = new Redis(kRedisLink);
        sclient.subscribe(topic);

        sclient.on("message", (_, data) => {
            const parsedData = JSON.parse(data) as T;
            if (filter(parsedData)) channel.push(parsedData);
        });

        const iterable = channel.wrap(() => sclient.disconnect());

        return iterable;
    }
}

export class PubSubClientRedisSmartImpl extends EventEmitter implements PubSubClient {
    private _pub: Redis;
    private _sub: Redis;

    constructor() {
        super();
        this._pub = new Redis(kRedisLink);
        this._sub = new Redis(kRedisLink);
        this._sub.on("message", (topic, data) => {
            const parsedData = JSON.parse(data);
            this.emit(topic, parsedData);
        });
    }

    public publish<T>(topic: string, data: T) {
        this._pub.publish(topic, JSON.stringify(data));
    }

    public subscribe<T>(topic: string, filter: (data: T) => boolean): WrappedBalancer<T> {
        if (this.listenerCount(topic) === 0) this._sub.subscribe(topic);

        const channel = new Channel<T>();

        const localListener = (data: T) => {
            if (filter(data)) channel.push(data);
        };

        this.on(topic, localListener);

        const iterable = channel.wrap(() => {
            this.off(topic, localListener);
            if (this.listenerCount(topic) === 0) this._sub.unsubscribe(topic);
        });
        return iterable;
    }
}

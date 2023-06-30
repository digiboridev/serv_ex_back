import { WrappedBalancer } from "queueable";

export interface PubSubClient {
    /**
     * Publishes data to a topic
     * @param topic The topic to publish to
     * @param data The data to publish
     * @returns void
     */
    publish<T>(topic: string, data: T): void;

    /**
     * Subscribes to a topic
     * @param topic The topic to subscribe to
     * @param filter A filter to apply to the data
     * @returns An iterable that can be used to iterate over the data
     * @example
     * const iterable = pubsub.subscribe("topic", (data) => data > 5);
     **/
    subscribe<T>(topic: string, filter: (data: T) => boolean): WrappedBalancer<T>;
}

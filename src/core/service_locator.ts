import { PubSubService } from "../domain/services/pubsub.service";

export class SL {
    private static _pubSub: PubSubService;

    public static set RegisterPubSub(pubSub: PubSubService) {
        this._pubSub = pubSub;
    }

    public static get pubSub(): PubSubService {
        return this._pubSub;
    }
}
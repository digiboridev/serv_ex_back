import { CacheService } from "../domain/services/cache.service";
import { PubSubService } from "../domain/services/pubsub.service";

export class SL {
    private static _pubSub: PubSubService;
    private static _cache: CacheService;

    public static set RegisterPubSub(pubSub: PubSubService) {
        this._pubSub = pubSub;
    }

    public static get pubSub(): PubSubService {
        return this._pubSub;
    }

    public static set RegisterCache(cache: CacheService) {
        this._cache = cache;
    }

    public static get cache(): CacheService {
        return this._cache;
    }
    
}
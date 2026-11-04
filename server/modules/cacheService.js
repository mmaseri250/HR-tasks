/**
 * server/modules/cacheService.js
 * In-Memory High-Speed TTL Cache for Dashboard & Hot Read APIs
 * 
 * Provides microsecond response times for read-heavy routes while guaranteeing
 * fresh data via automated invalidation on data mutation.
 */

class CacheService {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  }

  set(key, data, ttlSeconds = 30) {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });
  }

  del(key) {
    this.store.delete(key);
  }

  invalidateGroup(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear() {
    this.store.clear();
  }

  /**
   * Express middleware for route caching with X-Cache headers
   */
  routeCache(ttlSeconds = 30, keyGenerator = null) {
    return (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET') return next();

      const key = keyGenerator ? keyGenerator(req) : `${req.baseUrl || ''}${req.path}_${JSON.stringify(req.query)}`;
      const cached = this.get(key);

      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }

      // Intercept res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(key, body, ttlSeconds);
        }
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    };
  }
}

const cacheService = new CacheService();
module.exports = cacheService;

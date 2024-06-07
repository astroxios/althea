import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
});

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;

    try {
        const cacheResponse = await redis.get(key);

        if (cacheResponse) {
            return res.json(JSON.parse(cacheResponse));
        } else {
            res.sendResponse = res.json.bind(res);
            (res as any).json = async (body: any) => {
                // Set cache expiration for 1 hour
                await redis.set(key, JSON.stringify(body), 'EX', 3600);
                (res as any).sendResponse(body);
            }
            next();
        }
    } catch (e) {
        console.error(e);
        next();
    }
};

// Extend Request interface to include sendResponse property
declare global {
    namespace Express {
      export interface Response {
        sendResponse?: any;
      }
    }
}

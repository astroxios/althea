import { Request, Response, NextFunction } from 'express';
import redisClient from '../redisClient';
import crypto from 'crypto';

export const generateETag = (data: any): string => {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const cachedData = await redisClient.get(id);

        if (cachedData) {
            const { response, etag } = JSON.parse(cachedData);
            const incomingETag = req.headers['if-none-match'];

            if (etag === incomingETag) {
                return res.status(304).end(); // Not modified
            }

            res.setHeader('ETag', etag);
            return res.json(response);
        }

        const originalJson = res.json.bind(res);

        res.json = (body: any) => {
            const etag = generateETag(body);
            const cachedResponse = { response: body, etag };

            // Cache for 1 hour
            redisClient.setex(id, 3600, JSON.stringify(cachedResponse));

            res.setHeader('ETag', etag);
            return originalJson(body);
        };

        next();
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
};

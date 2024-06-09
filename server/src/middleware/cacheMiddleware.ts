import { Request, Response, NextFunction } from 'express';
import redisClient from '../redisClient';

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const cachedData = await redisClient.get(id);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      redisClient.setex(id, 3600, JSON.stringify(body)); // Cache for 1 hour
      return originalJson(body);
    };

    next();
  } catch (error) {
    console.error('Redis error:', error);
    next();
  }
};

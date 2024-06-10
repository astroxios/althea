import { Request, Response, NextFunction } from 'express';
import { cacheMiddleware } from '../../src/middleware/cacheMiddleware';
import redisClient from '../../src/redisClient';
import crypto from 'crypto';

jest.mock('../../src/redisClient', () => ({
  get: jest.fn(),
  setex: jest.fn(),
}));

const generateETag = (data: any): string => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

describe('cacheMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { params: { id: '123' }, headers: {} };
    res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(() => {
    if (typeof redisClient.quit === 'function') {
      redisClient.quit();
    }
  });

  it('should return cached data if exists and ETag matches', async () => {
    const data = { message: 'User retrieval successful', data: [{ id: 1, username: 'updated_user' }] };
    const etag = generateETag(data);
    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({ response: data, etag }));
    req!.headers!['if-none-match'] = etag;

    await cacheMiddleware(req as Request, res as Response, next);

    expect(redisClient.get).toHaveBeenCalledWith('123');
    expect(res.sendStatus).toHaveBeenCalledWith(304);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return cached data if exists and ETag does not match', async () => {
    const data = { message: 'User retrieval successful', data: [{ id: 1, username: 'updated_user' }] };
    const etag = generateETag(data);
    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({ response: data, etag }));
    req!.headers!['if-none-match'] = 'different-etag';

    await cacheMiddleware(req as Request, res as Response, next);

    expect(redisClient.get).toHaveBeenCalledWith('123');
    expect(res.setHeader).toHaveBeenCalledWith('ETag', etag);
    expect(res.json).toHaveBeenCalledWith(data);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if no cached data', async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    await cacheMiddleware(req as Request, res as Response, next);

    expect(redisClient.get).toHaveBeenCalledWith('123');
    expect(next).toHaveBeenCalled();
  });

  it('should cache data after response', async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    const originalJson = (res.json as jest.Mock).bind(res);

    res.json = (body: any) => {
        const etag = generateETag(body);
        const cachedResponse = { response: body, etag };
        redisClient.setex('123', 3600, JSON.stringify(cachedResponse));
        res.setHeader!('ETag', etag);
        return originalJson!(body);
    };

    await cacheMiddleware(req as Request, res as Response, next);

    const mockBody = { message: 'User retrieval successful', data: [{ id: 1, username: 'updated_user' }] };
    res.json(mockBody);

    expect(redisClient.setex).toHaveBeenCalledWith('123', 3600, JSON.stringify({ response: mockBody, etag: generateETag(mockBody) }));
    expect(res.setHeader).toHaveBeenCalledWith('ETag', generateETag(mockBody));
  });
});

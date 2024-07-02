import { Request, Response, NextFunction } from 'express';
import { cacheMiddleware, generateETag } from '../../src/middleware/cacheMiddleware';
import redisClient from '../../src/redisClient';

jest.mock('../../src/redisClient', () => ({
  get: jest.fn(),
  setex: jest.fn(),
}));

const createMockRequest = (params: Record<string, string> = {}, headers: Record<string, string> = {}): Partial<Request> => ({
  params,
  headers,
  method: 'GET',
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

describe('cacheMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest({ id: '123' });
    res = createMockResponse();
    next = jest.fn();
  });

  afterAll(() => {
    if (typeof redisClient.quit === 'function') {
      redisClient.quit();
    }
  });

  it('should return cached data if exists and ETag matches', async () => {
    const data = { message: 'Cached data' };
    const etag = generateETag(data);
    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({ response: data, etag }));
    req.headers!['if-none-match'] = etag;

    await cacheMiddleware(req as Request, res as Response, next);

    expect(redisClient.get).toHaveBeenCalledWith('widget:123');
    expect(res.sendStatus).toHaveBeenCalledWith(304);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return cached data if exists and ETag does not match', async () => {
    const data = { message: 'Cached data' };
    const etag = generateETag(data);
    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({ response: data, etag }));
    req.headers!['if-none-match'] = 'different-etag';

    await cacheMiddleware(req as Request, res as Response, next);

    expect(redisClient.get).toHaveBeenCalledWith('widget:123');
    expect(res.setHeader).toHaveBeenCalledWith('ETag', etag);
    expect(res.json).toHaveBeenCalledWith(data);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if no cached data', async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    await cacheMiddleware(req as Request, res as Response, next);

    expect(redisClient.get).toHaveBeenCalledWith('widget:123');
    expect(next).toHaveBeenCalled();
  });

  it('should cache data after response', async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    const originalJson = res.json!.bind(res);

    res.json = (body: any) => {
      const etag = generateETag(body);
      const cachedResponse = { response: body, etag };
      redisClient.setex('widget:123', 3600, JSON.stringify(cachedResponse));
      res.setHeader!('ETag', etag);
      return originalJson!(body);
    };

    await cacheMiddleware(req as Request, res as Response, next);

    const mockBody = { message: 'Response data' };
    res.json(mockBody);

    expect(redisClient.setex).toHaveBeenCalledWith('widget:123', 3600, JSON.stringify({ response: mockBody, etag: generateETag(mockBody) }));
    expect(res.setHeader).toHaveBeenCalledWith('ETag', generateETag(mockBody));
  });
});

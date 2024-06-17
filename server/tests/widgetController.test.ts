import request from 'supertest';
import express from 'express';
import widgetRoutes from '../src/routes/widgetRoutes';
import prismaMock from './__mocks__/prismaClient';

// Mock the prisma client
jest.mock('../src/services/widgetService', () => ({
  ...jest.requireActual('../src/services/widgetService'),
  getWidgets: () => prismaMock.widget.findMany(),
  createWidget: (name: string, typeId: number) => prismaMock.widget.create({ data: { name, typeId } }),
  updateWidget: (id: number, isActive: boolean) => prismaMock.widget.update({ where: { id }, data: { is_active: isActive } }),
  deleteWidget: (id: number) => prismaMock.widget.delete({ where: { id } }),
}));

// Mock the verifyToken function
jest.mock('../src/utils/verifyToken', () => ({
  verifyToken: jest.fn(() => ({ id: 1, email: 'test_user@example.com', username: 'test_user' })),
}));

const app = express();
app.use(express.json());

// Mock authenticate middleware to bypass authentication
jest.mock('../src/middleware/authMiddleware', () => ({
  authenticate: (req: express.Request, res: express.Response, next: express.NextFunction) => next(),
}));

app.use('/api', widgetRoutes);

describe('Widget API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/widgets - should return all widgets', async () => {
    const mockWidgets = [
      { id: 1, name: 'Test Widget', is_active: true, type: { id: 1, name: 'SCHEDULE' } },
    ];
    prismaMock.widget.findMany.mockResolvedValue(mockWidgets);

    const response = await request(app)
      .get('/api/widgets')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWidgets);
    expect(prismaMock.widget.findMany).toHaveBeenCalled();
  });

  test('POST /api/widgets - should create a new widget', async () => {
    const newWidget = { id: 1, name: 'New Widget', typeId: 1 };
    prismaMock.widget.create.mockResolvedValue(newWidget);

    const response = await request(app)
      .post('/api/widgets')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'New Widget', typeId: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newWidget);
    expect(prismaMock.widget.create).toHaveBeenCalledWith({
      data: { name: 'New Widget', typeId: 1 },
    });
  });

  test('PUT /api/widgets/:id - should update a widget', async () => {
    const updatedWidget = { id: 1, name: 'Updated Widget', is_active: false };
    prismaMock.widget.update.mockResolvedValue(updatedWidget);

    const response = await request(app)
      .put('/api/widgets/1')
      .set('Authorization', 'Bearer valid-token')
      .send({ isActive: false });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedWidget);
    expect(prismaMock.widget.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { is_active: false },
    });
  });

  test('DELETE /api/widgets/:id - should delete a widget', async () => {
    prismaMock.widget.delete.mockResolvedValue({ id: 1 });

    const response = await request(app)
      .delete('/api/widgets/1')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(204);
    expect(prismaMock.widget.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

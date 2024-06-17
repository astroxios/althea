const mockPrismaClient = {
    widget: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    widgetType: {
      upsert: jest.fn(),
    },
    user: {
      create: jest.fn(),
    },
  };

  export default mockPrismaClient;

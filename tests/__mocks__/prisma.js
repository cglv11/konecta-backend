const prisma = {
  employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
  },
};

module.exports = { prisma };

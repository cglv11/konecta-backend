const { PrismaClient } = require('@prisma/client');

class Database {
  constructor() {
    if (!Database.instance) {
      this.prisma = new PrismaClient();
      Database.instance = this;
    }

    return Database.instance;
  }

  async connectDb() {
    try {
      await this.prisma.$connect();
      console.log('Database connected successfully.');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1);
    }
  }
}

const dbInstance = new Database();

module.exports = {
  prisma: dbInstance.prisma,
  connectDb: dbInstance.connectDb.bind(dbInstance)
};

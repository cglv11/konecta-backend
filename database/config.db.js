const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDb = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

module.exports = { prisma, connectDb };

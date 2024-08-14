const bcryptjs = require('bcryptjs');
const { prisma } = require('./config.db');

async function seedAdmin() {
    try {
        const existingAdmin = await prisma.employee.findUnique({
            where: { username: 'super_admin' }
        });

        if (!existingAdmin) {
            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync('admin', salt);

            await prisma.employee.create({
                data: {
                    username: 'super_admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                    hireDate: new Date('2024-08-12T00:00:00.000Z'),
                    name: 'Pepito Perez',
                    salary: 10000,
                    state: true
                }
            });

            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();

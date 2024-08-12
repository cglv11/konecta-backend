// scripts/migrate.js
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/migrator'); // Asegúrate de tener instalada esta dependencia si usas migraciones
const postgres = require('postgres');
const User = require('../models/user');
const Employee = require('../models/employee');
const Request = require('../models/request');

// Conectar a la base de datos
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Inicializar Drizzles
const db = drizzle(client);

// Ejecutar migraciones
(async () => {
    try {
        await migrate(db, {
            migrationsFolder: './migrations', // Asegúrate de tener un folder de migraciones si es necesario
            migrations: [
                User,
                Employee,
                Request
            ]
        });
        console.log('Migrations completed successfully.');
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    } finally {
        client.end(); // Cerrar la conexión
    }
})();

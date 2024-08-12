const { pgTable, serial, varchar, numeric, integer, timestamp, date, boolean }  = require("drizzle-orm/pg-core");
const User = require('./user');

const Employee = pgTable('employees', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => User.id).notNull(),
    hireDate: date('hire_date').notNull(),
    name: varchar('name', 255).notNull(),
    salary: numeric('salary').notNull(),
    state: boolean('state').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
}, {
    schema: 'public',
});

module.exports = Employee;
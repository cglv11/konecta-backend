const { pgTable, serial, varchar, integer, timestamp, boolean }  = require("drizzle-orm/pg-core");
const Employee = require('./employee');

const Request = pgTable('requests', {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id').references(() => Employee.id).notNull(),
    code: varchar('code', 50).notNull(),
    description: varchar('description', 255).notNull(),
    summary: varchar('summary', 50).notNull(),
    state: boolean('state').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
}, {
    schema: 'public',
});

module.exports = Request;

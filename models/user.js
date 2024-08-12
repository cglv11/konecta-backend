const { pgTable, serial, varchar, timestamp, text, boolean } = require("drizzle-orm/pg-core");

const User = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', 255).unique().notNull(),
    password: text('password').notNull(),
    role: varchar('role', 20).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    state: boolean('state').default(true).notNull(),
}, {
    schema: 'public', 
});

module.exports = User;

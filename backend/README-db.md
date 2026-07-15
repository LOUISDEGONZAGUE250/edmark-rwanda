Edmark Rwanda - Database Design

This file describes the initial PostgreSQL schema for the Edmark Rwanda platform.

Files:
- `schema.sql` - SQL schema for tables: users, products, orders, order_items, distributor_applications, testimonials, contact_messages.

Next steps:
1. Review `schema.sql` and adjust types/indexes for production scale if needed.
2. Create a seed script to insert an admin user and sample products (`seed.js` exists; extend if necessary).
3. Use a migration tool (e.g., `node-pg-migrate`, `knex`, or `sequelize-cli`) for managed migrations in production.
4. Set `DATABASE_URL` in production to a secure value and keep `JWT_SECRET` secret.

Notes:
- The `schema.sql` includes indexes for product category and simple full-text on the `name` column.
- Passwords must be hashed using `bcrypt` before inserting into `users.password_hash`.

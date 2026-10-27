# Hospital Appointment API

A TypeScript CRUD exercise using Prisma 7, PostgreSQL, and the `patients`,
`doctors`, and `appointments` tables.

## Setup

1. Install PostgreSQL and create the database:

   ```powershell
   createdb hospital_api
   psql -d hospital_api -f sql/schema.sql
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your local
   PostgreSQL connection string. Never commit `.env`.

3. Install dependencies, generate Prisma Client, and run the test scripts:

   ```powershell
   npm install
   npm run db:generate
   npm run db:seed
   npm run test:crud
   ```

The Prisma schema is already cleaned and mapped to the existing database tables.
If you run `npm run db:pull`, Prisma overwrites `prisma/schema.prisma`; review
and reapply the model, field, and relation naming cleanup before generating the
client. `db pull` introspects the database; it does not apply migrations.

`npm run db:seed` upserts the sample patients and doctors and replaces only the
appointments for those sample patients. It does not wipe unrelated data.

## CRUD module

- `src/patients.ts`: create, find, search, update, and delete patients.
- `src/doctors.ts`: create, find, specialty search, and delete doctors. Deleting
  a doctor who still has appointments reports a clear restriction error.
- `src/appointments.ts`: book appointments with `connect`, fetch relations with
  `include`, list upcoming schedules, update status, cancel scheduled
  appointments, and delete appointments.

The test script creates uniquely named records, calls every CRUD operation,
checks the doctor-delete restriction, and removes its test data.

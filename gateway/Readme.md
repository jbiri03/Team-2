# HackScout API

This small Express server serves the frontend and reads public hackathon listings
from the team's PostgreSQL database.

## Requirements

- Node.js 20 or newer
- PostgreSQL with the team's `public.hackathons` table installed

## Configure and run

1. Install PostgreSQL for Windows from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
   During setup, keep the default port (`5432`) and remember the password you set
   for the `postgres` user. pgAdmin is included in the Windows installer.
2. Create a database named `hackathons` in pgAdmin (or with `createdb hackathons`).
3. Run the team's schema SQL against that database to create `public.hackathons`
   and `public.organizer_followups`. Restore the data dump only if it is safe to
   do so: the shared dump contains `DROP DATABASE IF EXISTS hackathons`, which
   deletes an existing database, and it does not include the table definitions.
   Back up anything important first and ask the team for a complete dump if
   their data file is intended to create the tables too.
4. In pgAdmin's Query Tool, create a database user for the app and grant it
   read-only access (run this while connected to `hackathons` as an admin):

   ```sql
   CREATE ROLE hackscout_reader LOGIN PASSWORD 'choose-a-local-password';
   GRANT CONNECT ON DATABASE hackathons TO hackscout_reader;
   GRANT USAGE ON SCHEMA public TO hackscout_reader;
   GRANT SELECT ON public.hackathons TO hackscout_reader;
   ```

   If that role already exists, use `ALTER ROLE hackscout_reader WITH PASSWORD
   'choose-a-local-password';` instead of creating it again.
5. In this `gateway` directory, copy `.env.example` to `.env` and replace
   `YOUR_PASSWORD` with the role password. Keep `.env` private.
6. Run `npm install`, then `npm start` from `gateway`.
7. Open <http://localhost:3000>. The listings page requests `GET /api/hackathons`.

The API uses a read-only query. It returns upcoming or undated records, excluding
records marked `Not Eligible`, `Closed/Expired`, or `Rejected as Unreliable`.
`GET /api/health` checks the database connection. If the API reports a database
connection error, check the PostgreSQL service, database name, password, and
that the team schema was run in the `hackathons` database.

To use a hosted team database instead of a local installation, set `DATABASE_URL`
to the connection string the team provides and follow their SSL/network access
requirements. Do not commit the connection string or share it publicly.

The attached data dump's inserts target tables under `hackathon_research`, while
the schema shared separately defines `public.hackathons` and
`public.organizer_followups`. Those are different schemas/tables: the API reads
`public.hackathons`, so its rows need to be loaded there. Ask the team for a
matching data export for `public.hackathons`; don't assume the attached inserts
populate it.

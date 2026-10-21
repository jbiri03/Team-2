# HackScout gateway

The gateway serves the frontend and exposes `GET /api/hackathons`. It reads
hackathon data from the team's Supabase GraphQL API and maps the normalized
`hackathon_research` schema to the shape the frontend already uses.

## Set up the Supabase project

1. In the intended Supabase project, open **SQL Editor** and run the team's
   schema SQL once. It creates the `hackathon_research` schema, including the
   `events`, `event_tracks`, `event_benefits`, `event_sources`, and
   `application_requirements` tables used by the gateway. It does not load the
   separate research data dump.
2. In **Project Settings → API → Exposed schemas**, add `hackathon_research`.
   If the project has an **Extra search path** setting, include it there too.
3. In SQL Editor, grant the server-only `service_role` read access to the
   schema and the tables queried by GraphQL:

   ```sql
   GRANT USAGE ON SCHEMA hackathon_research TO service_role;
   GRANT SELECT ON TABLE
     hackathon_research.events,
     hackathon_research.event_tracks,
     hackathon_research.event_benefits,
     hackathon_research.event_sources,
     hackathon_research.application_requirements
   TO service_role;
   ```

4. Open **API Docs → GraphQL → GraphiQL** and run a small read query to confirm
   the schema is visible:

   ```graphql
   {
     eventsCollection(first: 1) {
       edges {
         node {
           event_id
           event_name
         }
       }
     }
   }
   ```

   If `eventsCollection` is unknown, check that the SQL completed successfully,
   that `hackathon_research` is exposed and on the API search path, and that the
   GraphQL role has schema/table privileges.

## Configure the gateway

Set these environment variables in `gateway/.env` for local development and in
the Vercel project's server-side environment variables for deployments:

```dotenv
SUPABASE_GRAPHQL_URL=https://YOUR_PROJECT_REF.supabase.co/graphql/v1
SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_SECRET_KEY
```

Use the **same project** where the schema and event data live. Find its URL in
the Supabase project's **Connect** dialog and its Secret key in **Project
Settings → API Keys**. The current key format starts with `sb_secret_`. The
legacy `service_role` key also works if that is what the project provides.

This URL is the GraphQL endpoint, not the REST URL ending in `/rest/v1/`. The
gateway sends the key in the `apikey` header. Keep the Secret key server-side:
do not add it to frontend code, commit it, or use a `NEXT_PUBLIC_`/`VITE_`
variable. Restart the local gateway after changing `.env`.

From this directory, run `npm start` and check:

- `http://localhost:3000/api/health` — verifies the GraphQL connection and
  query access.
- `http://localhost:3000/api/hackathons` — returns the events the frontend
  displays.

The API returns every event, including past, closed, ineligible, and rejected
records. The client displays results in batches; use **Show more events** to
reveal additional listings. The existing client continues to fetch
`/api/hackathons`; the frontend does not receive Supabase credentials.

require("dotenv").config();

const express = require("express");
const path = require("node:path");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT || 3000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/api/health", async (_request, response, next) => {
  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/hackathons", async (_request, response, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        event_name,
        organizer,
        official_website,
        registration_link,
        rules_faq_url,
        city,
        state_region,
        country,
        venue,
        format,
        event_start,
        event_end,
        registration_deadline,
        registration_status,
        last_verified_date,
        student_eligibility,
        outside_school_eligibility,
        international_student_wording,
        age_rules,
        team_size,
        solo_team_formation_rules,
        registration_fee,
        travel_support,
        lodging,
        meals,
        reimbursement_conditions,
        technical_tracks,
        ai_policy,
        pre_existing_code_policy,
        ip_terms,
        judging_criteria,
        prizes,
        sponsor_recruiting_benefits,
        application_requirements,
        evidence_links,
        status,
        confidence
      FROM public.hackathons
      WHERE status NOT IN ('Not Eligible', 'Closed/Expired', 'Rejected as Unreliable')
        AND (
          COALESCE(event_end, event_start) IS NULL
          OR COALESCE(event_end, event_start) >= CURRENT_DATE
        )
      ORDER BY event_start ASC NULLS LAST, event_name ASC
    `);
    response.json(rows);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use((error, _request, response, _next) => {
  console.error("Request failed:", error);
  if (response.headersSent) return;
  response.status(500).json({ error: "The request could not be completed." });
});

const server = app.listen(port, () => {
  console.log(`HackScout is running at http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

require("dotenv").config();

const express = require("express");
const path = require("node:path");

const app = express();
const port = Number(process.env.PORT || 3000);

const eventsQuery = `
  query HackScoutEvents($after: Cursor) {
    eventsCollection(first: 30, after: $after) {
      edges {
        node {
          event_id
          event_name
          organizer_name
          official_website
          registration_link
          rules_faq_link
          city
          state_region
          country
          venue
          format
          event_start_date
          event_end_date
          registration_deadline_at
          registration_status
          last_verified_at
          student_eligibility
          outside_school_eligibility
          international_student_wording
          age_rules
          geographic_restrictions
          invitation_requirements
          team_size_min
          team_size_max
          solo_participation_policy
          team_formation_rules
          all_members_must_register
          registration_fee_amount
          registration_fee_currency
          registration_fee_notes
          travel_support
          lodging_support
          meals_support
          reimbursement_conditions
          ai_tool_policy
          pre_existing_code_policy
          intellectual_property_terms
          application_requirements
          operational_status
          evidence_confidence
          event_tracksCollection(first: 50) {
            edges {
              node {
                track_name
                description
              }
            }
          }
          event_benefitsCollection(first: 50) {
            edges {
              node {
                benefit_type
                title
                description
                award_value
              }
            }
          }
          event_sourcesCollection(first: 50) {
            edges {
              node {
                source_url
                source_title
              }
            }
          }
          application_requirementsCollection(first: 50) {
            edges {
              node {
                requirement_text
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const statusLabels = {
  verified_apply_now: "Verified - Apply Now",
  verified_registration_upcoming: "Verified - Registration Upcoming",
  monitor: "Monitor",
  needs_confirmation: "Needs Confirmation",
  not_eligible: "Not Eligible",
  closed_expired: "Closed/Expired",
  rejected_unreliable: "Rejected as Unreliable"
};

function connectionNodes(connection) {
  return (connection?.edges || []).map(({ node }) => node).filter(Boolean);
}

function displayEnum(value) {
  return value ? value.replaceAll("_", " ") : "";
}

function mapEvent(event) {
  const tracks = connectionNodes(event.event_tracksCollection);
  const benefits = connectionNodes(event.event_benefitsCollection);
  const sources = connectionNodes(event.event_sourcesCollection);
  const requirements = connectionNodes(event.application_requirementsCollection);
  const teamSize = event.team_size_min == null && event.team_size_max == null
    ? event.solo_participation_policy
    : `${event.team_size_min ?? "?"}-${event.team_size_max ?? "?"}`;
  const fee = [
    event.registration_fee_amount == null
      ? ""
      : `${event.registration_fee_amount}${event.registration_fee_currency ? ` ${event.registration_fee_currency.trim()}` : ""}`,
    event.registration_fee_notes
  ].filter(Boolean).join(" — ");
  const status = statusLabels[event.operational_status] || displayEnum(event.operational_status);
  const awards = benefits.filter(({ benefit_type }) => ["prize", "sponsor_prize"].includes(benefit_type));
  const otherBenefits = benefits.filter(({ benefit_type }) => !["prize", "sponsor_prize"].includes(benefit_type));

  return {
    id: event.event_id,
    event_name: event.event_name,
    organizer: event.organizer_name,
    official_website: event.official_website,
    registration_link: event.registration_link,
    rules_faq_url: event.rules_faq_link,
    city: event.city,
    state_region: event.state_region,
    country: event.country,
    venue: event.venue,
    format: event.format,
    event_start: event.event_start_date,
    event_end: event.event_end_date,
    registration_deadline: event.registration_deadline_at,
    registration_status: event.registration_status,
    last_verified_date: event.last_verified_at,
    student_eligibility: event.student_eligibility,
    outside_school_eligibility: event.outside_school_eligibility,
    international_student_wording: event.international_student_wording,
    age_rules: event.age_rules,
    team_size: teamSize,
    solo_team_formation_rules: [
      event.solo_participation_policy,
      event.team_formation_rules,
      event.all_members_must_register == null
        ? ""
        : event.all_members_must_register ? "All team members must register." : "Not all team members must register."
    ].filter(Boolean).join(" "),
    registration_fee: fee,
    travel_support: displayEnum(event.travel_support),
    lodging: displayEnum(event.lodging_support),
    meals: displayEnum(event.meals_support),
    reimbursement_conditions: event.reimbursement_conditions,
    technical_tracks: tracks.map(({ track_name, description }) => [track_name, description].filter(Boolean).join(": ")).join("; "),
    ai_policy: event.ai_tool_policy,
    pre_existing_code_policy: event.pre_existing_code_policy,
    ip_terms: event.intellectual_property_terms,
    application_requirements: [
      event.application_requirements,
      ...requirements.map(({ requirement_text }) => requirement_text)
    ].filter(Boolean).join("; "),
    prizes: awards.map(({ title, description, award_value }) =>
      [title, description, award_value].filter(Boolean).join(" — ")).join("; "),
    sponsor_recruiting_benefits: otherBenefits.map(({ title, description }) =>
      [title, description].filter(Boolean).join(" — ")).join("; "),
    evidence_links: sources.map(({ source_url, source_title }) => ({
      url: source_url,
      label: source_title
    })),
    status,
    confidence: event.evidence_confidence ? event.evidence_confidence[0].toUpperCase() + event.evidence_confidence.slice(1) : ""
  };
}

async function querySupabaseGraphql(query, variables = {}) {
  const endpoint = process.env.SUPABASE_GRAPHQL_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!endpoint || !secretKey) {
    throw new Error("Set SUPABASE_GRAPHQL_URL and SUPABASE_SECRET_KEY in the gateway environment.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: secretKey
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.json();

  if (!result || typeof result !== "object") {
    throw new Error(`Supabase GraphQL returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok || result.errors?.length) {
    const details = result.errors?.map(({ message }) => message).join("; ");
    throw new Error(`Supabase GraphQL request failed${details ? `: ${details}` : ` (HTTP ${response.status})`}`);
  }

  return result.data;
}

async function getEvents() {
  const events = [];
  let after = null;

  do {
    const data = await querySupabaseGraphql(eventsQuery, { after });
    const connection = data?.eventsCollection;

    if (!connection) {
      throw new Error("Supabase GraphQL response did not include eventsCollection.");
    }

    events.push(...connectionNodes(connection).map(mapEvent));

    if (connection.pageInfo?.hasNextPage && connection.pageInfo.endCursor === after) {
      throw new Error("Supabase GraphQL pagination did not advance.");
    }

    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);

  return events.sort((a, b) => {
    if (!a.event_start || !b.event_start) return a.event_start ? -1 : b.event_start ? 1 : a.event_name.localeCompare(b.event_name);
    return a.event_start.localeCompare(b.event_start) || a.event_name.localeCompare(b.event_name);
  });
}

app.get("/api/health", async (_request, response, next) => {
  try {
    await getEvents();
    response.json({ status: "ok", database: "connected", api: "graphql" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/hackathons", async (_request, response, next) => {
  try {
    response.json(await getEvents());
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

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));

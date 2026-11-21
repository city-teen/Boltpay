# Project memory

## Product intent & audience

- Sidra Pay exchange-rate board displaying UAE→India remittance rates.
- Operator-facing daily manual rate update capability.
- End-users viewing current remittance rates.

## Brand personality & voice

- Professional, financial-services tone.
- User communicates in Malayalam; UI labels appear in English (e.g., notice text in English). Likely bilingual context.

## Visual design & UX direction

- Vite + React + Tailwind + lucide-react (per `.bolt/prompt`); `@/` path alias.
- Rate card as primary element; secondary rate info cards beneath it.
- Yellow notice banner placed directly below rate card for high visibility.
- `Info` icon from lucide-react used in notice banner.
- Notice content: "This rate applies only for amounts above 25,000 Rs".
- Production-grade, non-cookie-cutter aesthetics.

## Decisions, constraints & rationale

- Minimum-amount threshold (25,000 Rs) surfaced as a prominent notice so users understand rate applicability before acting.
- Notice positioned immediately under rate card rather than in a footer/aside to maximize visibility.

## Open questions & assumptions

- Whether UI should be fully bilingual (Malayalam + English) or English-only with Malayalam user collaboration.
- Exact manual rate-update workflow (form, auth, persistence) not yet defined.
- Whether the 25,000 Rs threshold and notice text are configurable or hardcoded.
- Rate source and update cadence details beyond "daily manual."